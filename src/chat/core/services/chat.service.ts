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

  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>
  ) {}

  async addMessage(messageToRegister: Message){

    const messageEntity: MessageEntity = {id: 0 ,message: messageToRegister.message, user: messageToRegister.user.username, room: messageToRegister.user.room, isSystemInfo: messageToRegister.isSystemInfo, timestamp: messageToRegister.timestamp}
    const message = await this.messageRepository.create(messageEntity);
    await this.messageRepository.save(message);
  }

  async getAllMessages(room: string): Promise<Message[]>{

    const messagesEntity: MessageEntity[] = await this.messageRepository.find({ where: `room ILIKE '${room}'`})

    const messages: Message[] = messagesEntity.map((messageEntity) => {
      return {message: messageEntity.message, user: {id: '', username: messageEntity.user, room: messageEntity.room}, isSystemInfo: messageEntity.isSystemInfo, timestamp: messageEntity.timestamp}
    })

    return messages;
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
