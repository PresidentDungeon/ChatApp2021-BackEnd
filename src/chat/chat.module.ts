import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './shared/chat.service';
import { ChatController } from './chat.controller';
import { UserService } from "../user/shared/user.service";

@Module({
  providers: [ChatGateway, ChatService, UserService],
  controllers: [ChatController],
})
export class ChatModule {}
