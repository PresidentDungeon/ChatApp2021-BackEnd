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
  async handleRegisterEvent(@MessageBody() user: User, @ConnectedSocket() client: Socket) {

    user.id = client.id;
    let existingUser: User = await this.userService.getUserByClient(client.id);

    const result = await this.userService.registerUser(user);

      if (result) {
        if (existingUser) {
            this.server.in(existingUser.room).emit('userLeave', existingUser);
            this.handleSystemInfo(existingUser, `${existingUser.username} left the chat!`);
            client.leaveAll();
        }

        client.join(user.room.toLowerCase());
        this.server.in(user.room).emit('userJoin', user);
        this.server.emit('activeUsers', await this.userService.getActiveUsersCount());
        this.handleSystemInfo(user, `${user.username} joined the chat!`);
        client.emit('registerResponse', { created: true, errorMessage: '', user: user })
      } else {
        client.emit('registerResponse', {
          created: false,
          errorMessage: 'User with same name already exists',
          user: null
        })
      }
  }

  @SubscribeMessage('unregister')
  async handleUnregisterEvent(@ConnectedSocket() client: Socket){

    const success = await this.userService.unregisterUser(client.id);
    if(success.removed){
      const activeUsers: number = await this.userService.getActiveUsersCount();
      this.server.emit('userLeave', success.user);
      this.server.emit('activeUsers', activeUsers);
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
  }

  async handleDisconnect(client: Socket) {
    let success: any = await this.userService.unregisterAllUsersByClient(client.id);
    if(success.removed){this.server.emit('userLeave', success.user); this.handleSystemInfo(success.user, `${success.user.username} left the chat!`); this.server.emit('activeUsers', this.userService.getActiveUsersCount());}
  }

}
