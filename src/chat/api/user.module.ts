import { Module } from '@nestjs/common';
import { UserService } from "../core/services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserGateway } from "./gateways/user.gateway";
import { ChatModule } from "./chat.module";
import { IUserServiceProvider } from "../core/primary-ports/user.service.interface";

@Module({
  providers: [UserGateway, {provide: IUserServiceProvider, useClass: UserService}],
  controllers: [UserController],
  exports: [IUserServiceProvider],
  imports: [ChatModule]
})
export class UserModule {}
