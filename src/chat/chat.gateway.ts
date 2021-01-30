import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  private typingUsers: string[] = [];
  private connectedUsers: string[] = [];


  @WebSocketServer() server;

  @SubscribeMessage('register')
    handleRegisterEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): string{

    if(this.connectedUsers.find(user => user.toLocaleLowerCase() === data.toLocaleLowerCase())){
      client.emit('registerResponse', false);
    }
    else{this.connectedUsers.push(data); client.emit("registerResponse", true);}
    return "done";
    }

  @SubscribeMessage('unregister')
  handleUnregisterEvent(@MessageBody() data: string): string {

    var index = this.connectedUsers.indexOf(data);
    if (index !== -1) {this.connectedUsers.splice(index, 1); console.log('removed');}

    //Send deleted to clients for removal in online users

    return "deleted";

  }


  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() data: string): string {
    this.server.emit('messages', data);
    return 'Hello' + data;
  }

  @SubscribeMessage('typing')
  handleTypeEvent(@MessageBody() data: any): string {
    
    if(data.typing){
      this.typingUsers.push(data.user);
    }
    else{
      console.log("removed?");
      console.log(this.typingUsers);

      var index = this.typingUsers.indexOf(data.user);
      if (index !== -1) {this.typingUsers.splice(index, 1);}

      console.log(this.typingUsers);
    }
    this.server.emit('typers', this.typingUsers.slice(0,5));

    return "Done";
  }

//Ellers lav to handlers - en som fjerner den der ikke skriver fra listen og en som tilføjer en som skriver til listen... :)

  handleConnection(client: any, ...args: any[]): any {
  }

  handleDisconnect(client: any): any {
  }

}
