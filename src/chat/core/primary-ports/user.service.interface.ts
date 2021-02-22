import { User } from "../models/user";

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  registerUser(userToRegister: User): Promise<boolean>;

  unregisterUser(id: string): Promise<any>;

  unregisterAllUsersByClient(id: string): Promise<any>;

  getConnectedUsers(room: string): User[];

  getAllConnectedUsers(): User[];

  checkForExistingUser(username: String): boolean;

  getUserByClient(id: string): User;

  getActiveUsersCount(): number;

}
