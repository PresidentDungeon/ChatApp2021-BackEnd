import { Injectable } from '@nestjs/common';
import { User } from "../models/user";

@Injectable()
export class UserService {

  private connectedUsers: User[] = []

  registerUser(userToRegister: User): boolean{

    if(this.connectedUsers.find(user => user.username.toLocaleLowerCase() === userToRegister.username.toLocaleLowerCase() && user.room === userToRegister.room)){
      return false;
    }

    else{this.connectedUsers.push(userToRegister); return true;}
  }

  unregisterUser(id: string): any{

    let user: User = this.connectedUsers.find(user => user.id === id);
    let index: number = this.connectedUsers.indexOf(user);

    if(index !== -1){this.connectedUsers.splice(index, 1); return {removed: true, user: user};}
    return {removed: false, user: null};
  }

  unregisterAllUsersByClient(id: string): any{

    let user: User = this.connectedUsers.find(user => user.id === id);

    if (user) {this.connectedUsers = this.connectedUsers.filter(c => c.id !== id); return {removed: true, user: user};}
    return {removed: false, user: null};
  }

  getConnectedUsers(room: string): User[]{
    return this.connectedUsers.filter((user) => user.room === room);
  }

  getAllConnectedUsers(): User[]{
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

  getActiveUsersCount(): number{
    return this.connectedUsers.length;
  }

}
