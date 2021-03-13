import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";

import { Message } from "../../core/models/message";
import { Server, Socket } from "socket.io";
import { IChatService, IChatServiceProvider } from "../../core/primary-ports/chat.service.interface";
import { Inject } from "@nestjs/common";
import { IUserService, IUserServiceProvider } from "../../core/primary-ports/user.service.interface";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  constructor( @Inject(IChatServiceProvider) private chatService: IChatService) {}

  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: Message): void {
    this.chatService.addMessage(message);
    this.server.in(message.user.room).emit('messages', message);
  }

  handleConnection(client: Socket, ...args: any[]): any {
  }

  handleDisconnect(client: Socket): any {
  }

}
