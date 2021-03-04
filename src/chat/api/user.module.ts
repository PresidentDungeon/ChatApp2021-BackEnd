import { Module } from '@nestjs/common';
import { UserService } from "../core/services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserGateway } from "./gateways/user.gateway";
import { ChatModule } from "./chat.module";
import { IUserServiceProvider } from "../core/primary-ports/user.service.interface";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../infrastucture/data-source/entities/user.entity";

@Module({
  providers: [UserGateway, {provide: IUserServiceProvider, useClass: UserService}],
  controllers: [UserController],
  exports: [IUserServiceProvider],
  imports: [ChatModule, TypeOrmModule.forFeature([UserEntity])]
})
export class UserModule {}
