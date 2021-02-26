import { User } from "../models/user";

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  registerUser(userToRegister: User): Promise<boolean>;

  unregisterUser(id: string): Promise<any>;

  unregisterAllUsersByClient(id: string): Promise<any>;

  getConnectedUsers(room: string): Promise<User[]>;

  getAllConnectedUsers(): Promise<User[]>;

  checkForExistingUser(username: String): Promise<boolean>;

  getUserByClient(id: string): Promise<User>;

  getActiveUsersCount(): Promise<number>;

}
