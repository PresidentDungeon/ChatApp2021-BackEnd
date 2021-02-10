import { Body, Controller, Get, Post } from "@nestjs/common";
import { ChatService } from "./shared/chat.service";
import { ChatGateway } from "./chat.gateway";

@Controller('chat')

export class ChatController {

  constructor(private chatService: ChatService, private server: ChatGateway) {}

  @Post()
  GetMessages(@Body() data: any): any{
    return this.chatService.getAllMessages(data.room);
  }

}
