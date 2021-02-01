import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./shared/chat.service";
import { ChatGateway } from "./chat.gateway";

@Controller('chat')

export class ChatController {

  constructor(private chatService: ChatService, private server: ChatGateway) {}

  @Get()
  GetMessages(): any{
    return this.chatService.getAllMessages();
  }

}
