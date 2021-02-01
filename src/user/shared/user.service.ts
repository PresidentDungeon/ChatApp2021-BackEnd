import { Injectable } from '@nestjs/common';
import { Message } from "../../shared/message";

@Injectable()
export class UserService {

  private connectedUsers: string[] = [];

  registerUser(username: string): boolean{

    if(this.connectedUsers.find(user => user.toLocaleLowerCase() === username.toLocaleLowerCase())){
      return false;
    }

    else{this.connectedUsers.push(username); return true;}
  }

  unregisterUser(username: string): boolean{
    var index = this.connectedUsers.indexOf(username);
    if (index !== -1) {this.connectedUsers.splice(index, 1); return true;}
    return false;
  }

  getConnectedUsers(): string[]{
    return this.connectedUsers;
  }

}
