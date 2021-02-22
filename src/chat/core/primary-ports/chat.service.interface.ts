import { Message } from "../models/message";
import { User } from "../models/user";

export const IChatServiceProvider = 'IChatServiceProvider'
export interface IChatService{

  addMessage(message: Message): void

  getAllMessages(room: string): Message[]

  addTypingUser(user: User)

  removeTypingUser(id: string): void

  getRecentTypingUsers(room: string): User[]

  // registerMessageTest()
  //
  // getMessage()

}
