import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  // front: socket.emit("joinRoom", userId);
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(userId); // cliente entra na "room" com o id do usuário
    console.log(`Cliente ${client.id} entrou na sala ${userId}`);
  }

  // método que você pode chamar de qualquer lugar do backend
  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
    console.log(`Notificação enviada para ${userId}`, payload);
  }
}
