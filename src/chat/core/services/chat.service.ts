import { Injectable } from '@nestjs/common';
import { Message } from "../models/message";
import { User } from "../models/user";
import { IChatService } from "../primary-ports/chat.service.interface";

@Injectable()
export class ChatService implements IChatService{

  private typingUsers: User[] = [];
  private storedMessages: Message[] = [];

  addMessage(message: Message): void{
    this.storedMessages.push(message);
  }

  getAllMessages(room: string): Message[]{
    let message: Message[] = this.storedMessages.filter((c) => c.user.room.toLowerCase() === room.toLowerCase());
    return message;
  }

  addTypingUser(user: User){
    this.typingUsers.push(user);
  }

  removeTypingUser(id: string){

    var user = this.typingUsers.find(u => u.id === id);
    var index = this.typingUsers.indexOf(user);
    if (index !== -1) {this.typingUsers.splice(index, 1);}
  }

  getRecentTypingUsers(room: string): User[]{

    let typingUsers: User[] = this.typingUsers.filter(user => user.room === room);
    return typingUsers.slice(0,5);
  }

}
