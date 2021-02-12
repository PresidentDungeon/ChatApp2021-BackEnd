import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { UserService } from "../../core/services/user.service";
import { UserGateway } from "../gateways/user.gateway";
import { IUserService, IUserServiceProvider } from "../../core/primary-ports/user.service.interface";

@Controller('user')
export class UserController {

  constructor( @Inject(IUserServiceProvider) private userService: IUserService, private server: UserGateway) {}

  @Get('amount')
  GetConnectedUsersAmount(): number{
    return this.userService.getActiveUsersCount();
  }

  @Post('users')
  GetConnectedUsers(@Body() data: any): any{
    return this.userService.getConnectedUsers(data.room);
  }

  @Post()
  SearchUser(@Body() data: any): boolean{
    return this.userService.checkForExistingUser(data.user.username);
  }

}
