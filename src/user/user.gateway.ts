import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";

import { UserService } from "../user/shared/user.service";
import { User } from "../shared/user";

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server;

  constructor(private userService: UserService) {}

  @SubscribeMessage('unregister')
  handleUnregisterEvent(@MessageBody() user: User): boolean {
    let success: boolean = this.userService.unregisterUser(user);
    if(success){this.server.emit('userLeave', user); return true;}
    else{return false;}
  }

  handleConnection(client: any, ...args: any[]): any {
  //  console.log("connected:" + client.id);
  }

  handleDisconnect(client: any): any {
  //  console.log("disconnected:" + client.id);
  }

}
