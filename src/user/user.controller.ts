import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./shared/user.service";
import { UserGateway } from "./user.gateway";

@Controller('user')
export class UserController {

  constructor(private userService: UserService, private server: UserGateway) {}

  @Get()
  GetConnectedUsers(): any{
    return this.userService.getConnectedUsers();
  }

  @Get('amount')
  GetConnectedUsersAmount(): number{
    return this.userService.getActiveUsersCount();
  }

  @Post()
  SearchUser(@Body() data: any): boolean{
    return this.userService.checkForExistingUser(data.user.username);
  }

}
