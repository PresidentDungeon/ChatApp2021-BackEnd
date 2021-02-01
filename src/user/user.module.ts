import { Module } from '@nestjs/common';
import { UserService } from "./shared/user.service";
import { UserController } from "./user.controller";
import { UserGateway } from "./user.gateway";

@Module({
  providers: [UserGateway, UserService],
  controllers: [UserController]
})
export class UserModule {}
