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

    let result: boolean = this.userService.registerUser(user, client);

    if(result){
      this.server.emit('userJoin', user);
      client.emit('registerResponse', {created: true, errorMessage: ''})
    }

    else{client.emit('registerResponse', {created: false, errorMessage: 'User with same name already exists'})}
  }


  // @SubscribeMessage('unregister')
  // handleUnregisterEvent(@MessageBody() user: User): boolean {
  //   let success: boolean = this.userService.unregisterUser(user);
  //   if(success){this.server.emit('userLeave', user); return true;}
  //   else{return false;}
  // }

  @SubscribeMessage('unregister')
  handleUnregisterEvent(@ConnectedSocket() client: Socket): void {

    let success: any = this.userService.unregisterUser(client);
    if(success.removed){this.server.emit('userLeave', success.user); console.log("removed user");}
  }

  handleConnection(client: any, ...args: any[]): any {
  //  console.log("connected:" + client.id);
  }

  handleDisconnect(client: any): any {
  //  console.log("disconnected:" + client.id);
  }

}
