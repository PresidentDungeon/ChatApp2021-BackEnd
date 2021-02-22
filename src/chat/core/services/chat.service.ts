import { Injectable } from '@nestjs/common';
import { Message } from "../models/message";
import { User } from "../models/user";
import { IChatService } from "../primary-ports/chat.service.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import MessageEntity from "../../../entities/message.entity";

@Injectable()
export class ChatService implements IChatService{

  private typingUsers: User[] = [];
  private storedMessages: Message[] = [];

  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>
  ) {}

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

  // async registerMessageTest(){
  //   const newMessage = await this.messageRepository.create({title: 'test', content: 'this'});
  //   await this.messageRepository.save(newMessage);
  //   console.log(newMessage);
  // }
  //
  // async getMessage(){
  //   const newMessage = await this.messageRepository.create({id: 1, title: 'test', content: 'this'});
  //   await this.messageRepository.save(newMessage);
  //   console.log(newMessage);
  // }

}
