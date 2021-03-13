import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from '../core/services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { UserService } from "../core/services/user.service";
import { IChatServiceProvider } from "../core/primary-ports/chat.service.interface";
import { IUserServiceProvider } from "../core/primary-ports/user.service.interface";
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from "../infrastucture/data-source/entities/message.entity";
import { UserEntity } from "../infrastucture/data-source/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])],
  providers: [ChatGateway, {provide: IChatServiceProvider, useClass: ChatService}],
  controllers: [ChatController],
  exports: [IChatServiceProvider]
})
export class ChatModule {}
