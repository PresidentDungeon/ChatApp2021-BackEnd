import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./shared/user.service";
import { UserGateway } from "./user.gateway";

@Controller('user')
export class UserController {

  constructor(private userService: UserService, private server: UserGateway) {}

  @Post('register')
  RegisterUser(@Body() data: any): any {

    let result: boolean = this.userService.registerUser(data.username);

    if(result){
      this.server.server.emit('userJoin', data.username);
      return {created: true, errorMessage: ''};
    }

    else{return {created: false, errorMessage: 'User with same name already exists'};}
  }

  @Post('unregister')
  UnregisterUser(@Body() data: any): boolean{
    let success: boolean = this.userService.unregisterUser(data.username);
    if(success){this.server.server.emit('userLeave', data.username); return true;}
    else{return false;}
  }

  @Get()
  GetConnectedUsers(): any{
    return this.userService.getConnectedUsers();
  }

}
