import { Injectable } from '@nestjs/common';
import { Message } from "../models/message";
import { IChatService } from "../primary-ports/chat.service.interface";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { MessageEntity } from "../../infrastucture/data-source/entities/message.entity";

@Injectable()
export class ChatService implements IChatService{

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

}
