
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway({ path: '/api/conference/connect' })
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket) {
    console.log('Client connected');
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: WebSocket, @MessageBody() payload: any): void {
    this.server.clients.forEach((connectedClient) => {
      if (connectedClient !== client && connectedClient.readyState === WebSocket.OPEN) {
        connectedClient.send(payload);
      }
    });
  }
}