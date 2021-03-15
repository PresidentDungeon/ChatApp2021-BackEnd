import { User } from "../models/user";

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  registerUser(userToRegister: User): Promise<boolean>;

  unregisterUser(id: string): Promise<User>;

  unregisterAllUsersByClient(id: string): Promise<User>;

  getConnectedUsers(room: string): Promise<User[]>;

  getAllConnectedUsers(): Promise<User[]>;

  checkForExistingUser(username: String): Promise<boolean>;

  getUserByClient(id: string): Promise<User>;

  getActiveUsersCount(): Promise<number>;

  addTypingUser(user: User): Promise<boolean>;

  removeTypingUser(id: string): Promise<boolean>;

  getRecentTypingUsers(room: string): Promise<User[]>;

}
