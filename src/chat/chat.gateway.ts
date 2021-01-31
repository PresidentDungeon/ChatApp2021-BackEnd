import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Message } from "./shared/message";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server;
  private typingUsers: string[] = [];
  private connectedUsers: string[] = [];
  private messages: Message[] = [];

  @SubscribeMessage('register')
    handleRegisterEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): string{

    if(this.connectedUsers.find(user => user.toLocaleLowerCase() === data.toLocaleLowerCase())){
      client.emit('registerResponse', false);
    }
    else{
      this.connectedUsers.push(data);

      //User joins chat...
      this.server.emit('userJoin', data)

      client.emit("registerResponse", true);}
    return "done";
    }

  @SubscribeMessage('unregister')
  handleUnregisterEvent(@MessageBody() userName: string): string {

    var index = this.connectedUsers.indexOf(userName);
    if (index !== -1) {this.connectedUsers.splice(index, 1); console.log('removed');}

    //Send deleted to clients for removal in online users
    this.server.emit('userLeave', userName)

    return "deleted";
  }

  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: Message): string {
    this.server.emit('messages', message);
    return 'Hello' + message;
  }

  @SubscribeMessage('typing')
  handleTypeEvent(@MessageBody() data: any): string {

    if(data.typing){
      this.typingUsers.push(data.user);
    }
    else{
      var index = this.typingUsers.indexOf(data.user);
      if (index !== -1) {this.typingUsers.splice(index, 1);}
    }
    this.server.emit('typers', this.typingUsers.slice(0,5));

    return "Done";
  }

  @SubscribeMessage('requestUsers')
  handleUserRequestEvent(@ConnectedSocket() client: Socket): string{
    client.emit('responseUsers', this.connectedUsers);
    return "clients emitted";
  }

  handleConnection(client: any, ...args: any[]): any {
    //console.log("connected:" + client.id);
  }

  handleDisconnect(client: any): any {
    //console.log("disconnected:" + client.id);
  }

}
