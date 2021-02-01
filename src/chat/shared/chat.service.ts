import { Injectable } from '@nestjs/common';
import { Message } from "../../shared/message";

@Injectable()
export class ChatService {

  private typingUsers: string[] = [];
  private storedMessages: Message[] = [];

  addMessage(message: Message): void{
    this.storedMessages.push(message);
  }

  addTypingUser(user: string){
    this.typingUsers.push(user);
  }

  removeTypingUser(user: string){
    var index = this.typingUsers.indexOf(user);
    if (index !== -1) {this.typingUsers.splice(index, 1);}
  }

  getRecentTypingUsers(): string[]{
    return this.typingUsers.slice(0,5);
  }

}
