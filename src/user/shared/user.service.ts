import { Injectable } from '@nestjs/common';
import { User } from "../../shared/user";

@Injectable()
export class UserService {

  private connectedUsers: Map<string, User> = new Map<string, User>();


  registerUser(userToRegister: User, id: string): boolean{

    var connectedUsers: User[] = Array.from(this.connectedUsers.values());

    if(connectedUsers.find(user => user.username.toLocaleLowerCase() === userToRegister.username.toLocaleLowerCase())){
      return false;
    }

    else{this.connectedUsers.set(id, userToRegister); return true;}
  }

  unregisterUser(id: string): any{

    let user: User = this.connectedUsers.get(id);

    if (user) {this.connectedUsers.delete(id); return {removed: true, user: user};}
    return {removed: false, user: null};
  }

  getConnectedUsers(): User[]{
    return Array.from(this.connectedUsers.values());
  }

  checkForExistingUser(username: String): boolean{

    var connectedUsers: User[] = Array.from(this.connectedUsers.values());

    if(connectedUsers.find(u => u.username.toLocaleLowerCase() === username.toLocaleLowerCase())){
      return true;
    }
    return false;
  }

  getUserByClient(id: string): User{
    return this.connectedUsers.get(id);
  }

}
