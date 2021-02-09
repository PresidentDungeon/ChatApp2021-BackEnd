import { Injectable } from '@nestjs/common';
import { User } from "../../shared/user";

@Injectable()
export class UserService {

  private connectedUsers: User[] = []

  registerUser(userToRegister: User): boolean{

    if(this.connectedUsers.find(user => user.username.toLocaleLowerCase() === userToRegister.username.toLocaleLowerCase())){
      return false;
    }

    else{this.connectedUsers.push(userToRegister); return true;}
  }

  unregisterUser(id: string): any{
    console.log(this.connectedUsers);
    let user: User = this.connectedUsers.find(user => user.id === id);

    if (user) {this.connectedUsers = this.connectedUsers.filter(c => c.username !== user.username); console.log(this.connectedUsers); return {removed: true, user: user};}
    return {removed: false, user: null};
  }

  unregisterAllUsersByClient(id: string): any{

    let user: User = this.connectedUsers.find(user => user.id === id);

    if (user) {this.connectedUsers = this.connectedUsers.filter(c => c.id !== id); return {removed: true, user: user};}
    return {removed: false, user: null};
  }



  getConnectedUsers(): User[]{
    return this.connectedUsers;
  }

  checkForExistingUser(username: String): boolean{

    if(this.connectedUsers.find(u => u.username.toLocaleLowerCase() === username.toLocaleLowerCase())){
      return true;
    }
    return false;
  }

  getUserByClient(id: string): User{
    return this.connectedUsers.find(user => user.id === id);
  }

}
