import { User } from "./user";

export interface Message{
  message: string;
  user: User;
  timestamp: Date;
  isSystemInfo;
}
