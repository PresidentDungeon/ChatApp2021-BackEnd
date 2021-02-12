import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatService } from '../core/services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { UserService } from "../core/services/user.service";

@Module({
  providers: [ChatGateway, ChatService, UserService],
  controllers: [ChatController],
  exports: [ChatService]
})
export class ChatModule {}
