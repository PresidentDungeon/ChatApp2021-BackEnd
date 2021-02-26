import { Message } from "../models/message";
import { User } from "../models/user";

export const IChatServiceProvider = 'IChatServiceProvider'
export interface IChatService{

  addMessage(message: Message): void

  getAllMessages(room: string): Promise<Message[]>

  addTypingUser(user: User): void

  removeTypingUser(id: string): void

  getRecentTypingUsers(room: string): User[]

}
