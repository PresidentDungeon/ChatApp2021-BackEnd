import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";

import { User } from "../../core/models/user";
import { Socket } from "socket.io";
import { Message } from "../../core/models/message";
import { Inject } from "@nestjs/common";
import { IChatService, IChatServiceProvider } from "../../core/primary-ports/chat.service.interface";
import { IUserService, IUserServiceProvider } from "../../core/primary-ports/user.service.interface";

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server;

  constructor( @Inject(IUserServiceProvider) private userService: IUserService, @Inject(IChatServiceProvider) private chatService: IChatService) {}

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
        if(success.removed){
          this.server.in(existingUser.room).emit('userLeave', success.user);
          this.handleSystemInfo(existingUser, `${existingUser.username} left the chat!`);
          //console.log("After delete", this.userService.getAllConnectedUsers());
        client.leaveAll();

        }
      }

      client.join(user.room.toLowerCase());
      this.server.in(user.room).emit('userJoin', user);
      this.server.emit('activeUsers', this.userService.getActiveUsersCount());
      this.handleSystemInfo(user, `${user.username} joined the chat!`);
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

  private handleSystemInfo(user: User, message: string){
    let date = new Date();
    date.setTime(date.getTime() + 2*60*60*1000);

    let systemMessage: Message = {user: user, message: message, timestamp: new Date(date), isSystemInfo: true}
    this.chatService.addMessage(systemMessage);
    this.server.in(user.room).emit('messages', systemMessage);
  }


  handleConnection(client: any, ...args: any[]): any {
  //  console.log("connected:" + client.id);
  }

  handleDisconnect(client: Socket): any {
    //console.log("disconnected:" + client.id);

    let success: any = this.userService.unregisterAllUsersByClient(client.id);
    if(success.removed){this.server.emit('userLeave', success.user); this.handleSystemInfo(success.user, `${success.user.username} left the chat!`); this.server.emit('activeUsers', this.userService.getActiveUsersCount());}
  }

}
