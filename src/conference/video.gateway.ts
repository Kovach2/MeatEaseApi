import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'ws';
import { ConferenceService } from './conference.service';
import { Conference } from 'src/schemas/conference.schema';

@WebSocketGateway({ path: '/api/conference/connect' })
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly conferenceService: ConferenceService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket) {
    console.log('Client connected');
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('joinConference')
  async handleJoinConference(
    @MessageBody() data: { token: string; conferenceId: string },
    @ConnectedSocket() client: WebSocket
  ): Promise<void> {
    const { token, conferenceId } = data;
    await this.conferenceService.addUser({ conferenceId: conferenceId, token: token })
    const conference: Conference = await this.conferenceService.findConference({ conferenceId });
    if (conference && token) {
      client.send(JSON.stringify({ event: 'joinConference', success: true, conference }));
      this.broadcastToAllClients({ event: 'updateConference', success: true, conference });
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
    if(token && conferenceId){
      const newConference = await this.conferenceService.removeUser({ conferenceId: conferenceId, token: token })
      this.broadcastToAllClients({ event: 'updateConference', success: true, newConference });
    } else {
      client.send(JSON.stringify({ event: 'updateConference', success: false, message: 'Conference not found' }));
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
}
