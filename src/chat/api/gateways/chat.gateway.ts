import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";

import { Message } from "../../core/models/message";
import { ChatService } from "../../core/services/chat.service";
import { Server, Socket } from "socket.io";
import { User } from "../../core/models/user";
import { UserService } from "../../core/services/user.service";
import { IChatService, IChatServiceProvider } from "../../core/primary-ports/chat.service.interface";
import { Inject } from "@nestjs/common";
import { IUserService, IUserServiceProvider } from "../../core/primary-ports/user.service.interface";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  constructor( @Inject(IChatServiceProvider) private chatService: IChatService, @Inject(IUserServiceProvider) private userService: IUserService) {}

  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: Message): void {
    this.chatService.addMessage(message);
    this.server.in(message.user.room).emit('messages', message);
  }

  @SubscribeMessage('typing')
  handleTypeEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    if(data.typing){this.chatService.addTypingUser(data.user);}
    else{this.chatService.removeTypingUser(client.id);}
    this.server.in(data.user.room).emit('typers', this.chatService.getRecentTypingUsers(data.user.room));
  }

  handleConnection(client: Socket, ...args: any[]): any {
    //console.log("connected:" + client.id);
    //client.join
  }

  handleDisconnect(client: Socket): any {
    //console.log("disconnected:" + client.id);

    var user: User = this.userService.getUserByClient(client.id);
    if (user) {
      this.chatService.removeTypingUser(user.username);
      this.server.in(user.room).emit('typers', this.chatService.getRecentTypingUsers(user.room));
    }
  }

}
