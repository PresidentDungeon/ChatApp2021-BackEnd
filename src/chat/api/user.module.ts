import { Module } from '@nestjs/common';
import { UserService } from "../core/services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserGateway } from "./gateways/user.gateway";
import { ChatModule } from "./chat.module";

@Module({
  providers: [UserGateway, UserService],
  controllers: [UserController],
  exports: [UserService],
  imports: [ChatModule]
})
export class UserModule {}
