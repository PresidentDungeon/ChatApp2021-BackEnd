import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {

  @SubscribeMessage('chats')
  handleChatEvent(@MessageBody() data: string): string {
    return 'Hello' + data;
  }

}
