import { Module } from '@nestjs/common';
import { UserService } from "./shared/user.service";
import { UserController } from "./user.controller";
import { UserGateway } from "./user.gateway";
import { ChatService } from "../chat/shared/chat.service";
import { ChatModule } from "../chat/chat.module";

@Module({
  providers: [UserGateway, UserService],
  controllers: [UserController],
  exports: [UserService],
  imports: [ChatModule]
})
export class UserModule {}
