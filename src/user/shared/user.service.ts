import { Injectable } from '@nestjs/common';
import { User } from "../../shared/user";
import { Socket } from "socket.io";

@Injectable()
export class UserService {

  private connectedUsers: Map<string, User> = new Map<string, User>();


  registerUser(userToRegister: User, client: Socket): boolean{

    var connectedUsers: User[] = Array.from(this.connectedUsers.values());

    if(connectedUsers.find(user => user.username.toLocaleLowerCase() === userToRegister.username.toLocaleLowerCase())){
      return false;
    }

    else{this.connectedUsers.set(client.id, userToRegister); return true;}
  }

  // unregisterUser(user: User): boolean{
  //
  //   var index: number = -1;
  //
  //   for(var i = 0; i < this.connectedUsers.length; i++){
  //     if(this.connectedUsers[i].username === user.username){index = i; break;}
  //   }
  //
  //   if (index !== -1) {this.connectedUsers.splice(index, 1); console.log(this.connectedUsers); return true;}
  //   return false;
  // }

  unregisterUser(client: Socket): any{

    let user: User = this.connectedUsers.get(client.id);

    if (user) {this.connectedUsers.delete(client.id); return {removed: true, user: user};}
    return {removed: false, user: null};
  }

  getConnectedUsers(): User[]{
    return Array.from(this.connectedUsers.values());
  }

}
