import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ChatService } from "../../core/services/chat.service";
import { ChatGateway } from "../gateways/chat.gateway";
import { IChatService, IChatServiceProvider } from "../../core/primary-ports/chat.service.interface";

@Controller('chat')

export class ChatController {

  constructor( @Inject(IChatServiceProvider) private chatService: IChatService, private server: ChatGateway) {}

  @Post()
  GetMessages(@Body() data: any): any{
    return this.chatService.getAllMessages(data.room);
  }

}
