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
  handleRegisterEvent(@MessageBody() user: User, @ConnectedSocket() client: Socket) {

    user.id = client.id;

    this.userService.getUserByClient(client.id).then((existingUser) => {
      this.userService.registerUser(user).then((result) => {

        if(result){
          if(existingUser){
            this.server.in(existingUser.room).emit('userLeave', existingUser);
            this.handleSystemInfo(existingUser, `${existingUser.username} left the chat!`);
            client.leaveAll();
          }
          client.join(user.room.toLowerCase());
          this.server.in(user.room).emit('userJoin', user);
          this.userService.getActiveUsersCount().then((userCount) => {this.server.emit('activeUsers', userCount)});
          this.handleSystemInfo(user, `${user.username} joined the chat!`);
          client.emit('registerResponse', {created: true, errorMessage: '', user: user});
        }
        else{
          client.emit('registerResponse', {created: false, errorMessage: 'User with the same name already exists', user: null});
        }
      })
    })
  }

  @SubscribeMessage('unregister')
  async handleUnregisterEvent(@ConnectedSocket() client: Socket){

    this.userService.unregisterUser(client.id).then((success) => {
      if(success.removed){
        this.userService.getActiveUsersCount().then((activeUsers) => {this.server.emit('userLeave', success.user); this.server.emit('activeUsers', activeUsers);})
      }
    });
  }

  private handleSystemInfo(user: User, message: string){
    let date = new Date();
    date.setTime(date.getTime() + 2*60*60*1000);

    let systemMessage: Message = {user: user, message: message, timestamp: new Date(date), isSystemInfo: true}
    this.chatService.addMessage(systemMessage);
    this.server.in(user.room).emit('messages', systemMessage);
  }

  @SubscribeMessage('typing')
  handleTypeEvent(@MessageBody() data: any, @ConnectedSocket() client: Socket) {

    if(data.typing){
        this.userService.addTypingUser(data.user).then(() => {
          this.userService.getRecentTypingUsers(data.user.room).then((typingUsers) => {this.server.in(data.user.room).emit('typers', typingUsers);})
        })
    }

    else{
      this.userService.removeTypingUser(client.id).then(() => {
        this.userService.getRecentTypingUsers(data.user.room).then((typingUsers) => {this.server.in(data.user.room).emit('typers', typingUsers);})
      })
    }
  }

  handleConnection(client: any, ...args: any[]): any {
  }

  handleDisconnect(client: Socket) {

    this.userService.removeTypingUser(client.id).then((updatedStatus) => {
      if(updatedStatus){
        this.userService.getUserByClient(client.id).then((user) => {
          this.userService.removeTypingUser(user.username).then(() => {
            this.userService.getRecentTypingUsers(user.room).then((users) => {
              this.server.in(user.room).emit('typers', users);
            })});
        });
      }});

    this.userService.unregisterAllUsersByClient(client.id).then((success) => {
      if(success.removed){
        this.userService.getActiveUsersCount().then((count) => {
          this.server.emit('userLeave', success.user);
          this.handleSystemInfo(success.user, `${success.user.username} left the chat!`);
          this.server.emit('activeUsers', count);})
      }});
  }

}
