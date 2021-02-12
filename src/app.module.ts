import { Module } from '@nestjs/common';
import { ChatModule } from './chat/api/chat.module';
import { UserModule } from './chat/api/user.module';
import { ChatService } from "./chat/core/services/chat.service";

@Module({
  imports: [ChatModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
