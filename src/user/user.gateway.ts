import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from "@nestjs/websockets";

import { UserService } from "../user/shared/user.service";

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server;

  constructor(private userService: UserService) {}

  @SubscribeMessage('unregister')
  handleUnregisterEvent(@MessageBody() username: string): boolean {
    let success: boolean = this.userService.unregisterUser(username);
    if(success){this.server.emit('userLeave', username); return true;}
    else{return false;}
  }

  handleConnection(client: any, ...args: any[]): any {
  //  console.log("connected:" + client.id);
  }

  handleDisconnect(client: any): any {
  //  console.log("disconnected:" + client.id);
  }

}
