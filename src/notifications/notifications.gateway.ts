import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  joinRoom(clientId: string) {
    // o front emite "joinRoom", entramos na "room" do usuário
    this.server.sockets.sockets.get(clientId)?.join(clientId);
  }

  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }
}
