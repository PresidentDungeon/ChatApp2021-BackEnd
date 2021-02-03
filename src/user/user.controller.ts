import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./shared/user.service";
import { UserGateway } from "./user.gateway";
import { ConnectedSocket } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Controller('user')
export class UserController {

  constructor(private userService: UserService, private server: UserGateway) {}

  // @Post('registerNameCheck')
  // RegisterUser(@Body() data: any, @ConnectedSocket() client: Socket): any {
  //
  //   let result: boolean = this.userService.registerUser(data.user);
  //
  //   if(result){
  //     //this.server.server.emit('userJoin', data.user);
  //     return {created: true, errorMessage: ''};
  //   }
  //
  //   else{return {created: false, errorMessage: 'User with same name already exists'};}
  // }

  // @Post('unregister')
  // UnregisterUser(@Body() data: any): boolean{
  //   let success: boolean = this.userService.unregisterUser(data.user);
  //   if(success){this.server.server.emit('userLeave', data.user); return true;}
  //   else{return false;}
  // }

  @Get()
  GetConnectedUsers(): any{
    return this.userService.getConnectedUsers();
  }

}
