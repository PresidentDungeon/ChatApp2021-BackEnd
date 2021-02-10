import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { ChatService } from "./chat/shared/chat.service";

@Module({
  imports: [ChatModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
