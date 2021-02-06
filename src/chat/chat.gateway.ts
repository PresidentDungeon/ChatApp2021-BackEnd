import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";

import { Message } from "../shared/message";
import { ChatService } from "./shared/chat.service";
import { Socket } from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: Message): void {
    this.chatService.addMessage(message);
    this.server.emit('messages', message);
  }

  @SubscribeMessage('typing')
  handleTypeEvent(@MessageBody() data: any): void {
    if(data.typing){this.chatService.addTypingUser(data.user);}
    else{this.chatService.removeTypingUser(data.user);}
    this.server.emit('typers', this.chatService.getRecentTypingUsers());
  }

  handleConnection(client: any, ...args: any[]): any {
    //console.log("connected:" + client.id);
  }

  handleDisconnect(client: Socket): any {
    //console.log("disconnected:" + client.id);

    // var user: User = this.userService.getUserByClient(client);
    // if (user) {
    //   this.chatService.removeTypingUser(user.username);
    //   this.server.emit('typers', this.chatService.getRecentTypingUsers());
    // }
  }

}
