import { User } from "../models/user";

export const IUserServiceProvider = 'IUserServiceProvider'
export interface IUserService{

  registerUser(userToRegister: User): boolean;

  unregisterUser(id: string): any;

  unregisterAllUsersByClient(id: string): any;

  getConnectedUsers(room: string): User[];

  getAllConnectedUsers(): User[];

  checkForExistingUser(username: String): boolean;

  getUserByClient(id: string): User;

  getActiveUsersCount(): number;

}
