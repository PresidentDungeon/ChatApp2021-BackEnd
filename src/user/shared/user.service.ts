import { Injectable } from '@nestjs/common';
import { User } from "../../shared/user";

@Injectable()
export class UserService {

  private connectedUsers: User[] = [];

  registerUser(userToRegister: User): boolean{

    if(this.connectedUsers.find(user => user.username.toLocaleLowerCase() === userToRegister.username.toLocaleLowerCase())){
      return false;
    }

    else{this.connectedUsers.push(userToRegister); return true;}
  }

  unregisterUser(user: User): boolean{

    var index: number = -1;

    for(var i = 0; i < this.connectedUsers.length; i++){
      if(this.connectedUsers[i].username === user.username){index = i; break;}
    }

    if (index !== -1) {this.connectedUsers.splice(index, 1); console.log(this.connectedUsers); return true;}
    return false;
  }

  getConnectedUsers(): User[]{
    return this.connectedUsers;
  }

}
