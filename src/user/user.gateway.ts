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

    user.id = client.id;

    //console.log("Before register", this.userService.getAllConnectedUsers());


    let existingUser: User = this.userService.getUserByClient(client.id);
    let result: boolean = this.userService.registerUser(user);

    //console.log("After register", this.userService.getAllConnectedUsers());


    if(result){

      if(existingUser){
        let success: any = this.userService.unregisterUser(client.id);
        if(success.removed){this.server.in(existingUser.room).emit('userLeave', success.user);
          //console.log("After delete", this.userService.getAllConnectedUsers());
        client.leaveAll();

        }
      }

      client.join(user.room.toLowerCase());
      this.server.in(user.room).emit('userJoin', user);
      this.server.emit('activeUsers', this.userService.getActiveUsersCount());
      client.emit('registerResponse', {created: true, errorMessage: '', user: user})
    }

    else{client.emit('registerResponse', {created: false, errorMessage: 'User with same name already exists', user: null})}
  }

  @SubscribeMessage('unregister')
  handleUnregisterEvent(@ConnectedSocket() client: Socket): void {

    let success: any = this.userService.unregisterUser(client.id);
    if(success.removed){
      this.server.emit('userLeave', success.user);
      this.server.emit('activeUsers', this.userService.getActiveUsersCount());
    }
  }


  handleConnection(client: any, ...args: any[]): any {
  //  console.log("connected:" + client.id);
  }

  handleDisconnect(client: Socket): any {
    //console.log("disconnected:" + client.id);

    let success: any = this.userService.unregisterAllUsersByClient(client.id);
    if(success.removed){this.server.emit('userLeave', success.user); this.server.emit('activeUsers', this.userService.getActiveUsersCount());}
  }

}
