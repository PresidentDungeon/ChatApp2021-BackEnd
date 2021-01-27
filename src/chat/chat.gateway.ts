import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {

  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() data: string): string {
    console.log(data);
    return 'Hello' + data;
  }

}
