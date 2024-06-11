import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'ws';
import { ConferenceService } from './conference.service';
import { Conference } from 'src/schemas/conference.schema';

@WebSocketGateway({ path: '/api/conference/connect' })
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly conferenceService: ConferenceService) {}

  @WebSocketServer()
  server: Server;


  private clientsData = new Map<WebSocket, { token: string, conferenceId: string }>();

  handleConnection(client: WebSocket, req: Request) {
    console.log('Client connected');
    const { token, conferenceId } = this.extractParamsFromURL(req.url);
    if (token && conferenceId) {
      this.clientsData.set(client, { token, conferenceId });
    }
  }

  async handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
    const { token, conferenceId } = this.getClientData(client);
    if (token && conferenceId) {
        await this.removeUserAndUpdateConference(conferenceId, token);
    } else {
        this.sendUpdateFailureMessage(client);
    }
  }

  @SubscribeMessage('joinConference')
  async handleJoinConference(
    @MessageBody() data: { userId: string, token: string; conferenceId: string },
    @ConnectedSocket() client: WebSocket
  ): Promise<void> {
    const { userId, token, conferenceId } = data;
    console.log(data)
    const newUser = await this.conferenceService.addUser({ userId: userId, conferenceId: conferenceId, token: token })
    const conference: Conference = await this.conferenceService.findConference({ conferenceId });
    if (conference && token) {
      client.send(JSON.stringify({ event: 'joinConference', success: true, conference }));
      this.broadcastToAllClients({ event: 'userJoinToConference', success: true, newUser });
    } else {
      client.send(JSON.stringify({ event: 'joinConference', success: false, message: 'Conference not found' }));
    }
  }

  @SubscribeMessage('updateConference')
  async handleUpdateConference(
    @MessageBody() data: { token: string; conferenceId: string },
    @ConnectedSocket() client: WebSocket
  ): Promise<void> {
    const { token, conferenceId } = data;
    const conference: Conference = await this.conferenceService.findConference({ conferenceId });
    if (conference && token) {
      this.broadcastToAllClients({ event: 'updateConference', success: true, conference });
    } else {
      client.send(JSON.stringify({ event: 'updateConference', success: false, message: 'Conference not found' }));
    }
  }

  @SubscribeMessage("disconnectConference")
  async handledisconnetConference(
      @MessageBody() data: { token: string; conferenceId: string },
      @ConnectedSocket() client: WebSocket
  ): Promise<void> {
      const { token, conferenceId } = data;
      if (token && conferenceId) {
          await this.removeUserAndUpdateConference(conferenceId, token);
      } else {
          this.sendUpdateFailureMessage(client);
      }
  }

  @SubscribeMessage("updateUserState")
  async hanndleUpdateUserStaer(
      @MessageBody() data: { token: string; conferenceId: string, micOn: boolean, camOn: boolean },
      @ConnectedSocket() client: WebSocket
  ): Promise<void> {
    const {token, conferenceId, micOn, camOn} = data
    if (token && conferenceId) {
      await this.updateUserData(token, conferenceId, micOn, camOn);
    } else {
        this.sendUpdateFailureMessage(client);
    }
  }

  private broadcastToAllClients(message: any) {
    if (this.server && this.server.clients) {
      this.server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  private async updateUserData(token: string, conferenceId: string, micOn: boolean, camOn: boolean){
    const conference = await this.conferenceService.updateUserState({conferenceId, token, micOn, camOn})
    this.broadcastToAllClients({ event: 'updateConference', success: true, conference });
  }

  private async removeUserAndUpdateConference(conferenceId: string, token: string) {
    const conference = await this.conferenceService.removeUser({ conferenceId, token });
    this.broadcastToAllClients({ event: 'updateConference', success: true, conference });
    this.removeClientFromData(token, conferenceId);
  }

  private removeClientFromData(token: string, conferenceId: string) {
    this.clientsData.forEach((value, client) => {
        if (value.token === token && value.conferenceId === conferenceId) {
            this.clientsData.delete(client);
        }
    });
  }

  private sendUpdateFailureMessage(client: WebSocket) {
    client.send(JSON.stringify({ event: 'updateConference', success: false, message: 'Conference not found' }));
  }

  private extractParamsFromURL(url: string) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const token = urlParams.get('token');
    const conferenceId = urlParams.get('conferenceId');
    return { token, conferenceId };
  }

  private getClientData(client: WebSocket): { token: string, conferenceId: string } {
    const clientData = this.clientsData.get(client);
    return clientData || { token: '', conferenceId: '' };
  }
  
}