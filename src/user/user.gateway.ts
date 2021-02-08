import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";

import { UserService } from "../user/shared/user.service";
import { User } from "../shared/user";
import { Socket } from "socket.io";

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server;

  constructor(private userService: UserService) {}

  @SubscribeMessage('register')
  handleRegisterEvent(@MessageBody() user: User, @ConnectedSocket() client: Socket): void{

    let result: boolean = this.userService.registerUser(user, client.id);

    if(result){
      this.server.emit('userJoin', user);
      client.emit('registerResponse', {created: true, errorMessage: ''})
    }

    else{client.emit('registerResponse', {created: false, errorMessage: 'User with same name already exists'})}
  }

  @SubscribeMessage('unregister')
  handleUnregisterEvent(@ConnectedSocket() client: Socket): void {

    let success: any = this.userService.unregisterUser(client.id);
    if(success.removed){this.server.emit('userLeave', success.user);}
  }

  handleConnection(client: any, ...args: any[]): any {
  //  console.log("connected:" + client.id);
  }

  handleDisconnect(client: Socket): any {
    //console.log("disconnected:" + client.id);


    // let success: any = this.userService.unregisterUser(client.id);
    // if(success.removed){this.server.emit('userLeave', success.user);}
  }

}
