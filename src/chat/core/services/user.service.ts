import { Injectable } from '@nestjs/common';
import { User } from "../models/user";
import { IUserService } from "../primary-ports/user.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import UserEntity from "../../../entities/user.entity";

@Injectable()
export class UserService implements IUserService{

  private connectedUsers: User[] = []

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async registerUser(userToRegister: User): Promise<boolean>{

    const user = await this.userRepository.findOne({ where: { username: userToRegister.username, room: userToRegister.room } });
    if(user){return false;}

    else{
      const newUser = await this.userRepository.create(userToRegister);
      await this.userRepository.save(newUser);
      return true;
    }
  }

  async unregisterUser(id: string): Promise<any>{

    const user = await this.userRepository.findOne({ where: { id: id } });
    const deleteResponse = await this.userRepository.delete(id);

    if(deleteResponse.affected){return {removed: true, user: user};}
    return {removed: false, user: null};
  }

  async unregisterAllUsersByClient(id: string): Promise<any>{

    const user = await this.userRepository.findOne({ where: { id: id } });
    if (user) {const deleteResponse = await this.userRepository.delete({id: id}); if(deleteResponse.affected){return {removed: true, user: user};}}
    return {removed: false, user: null};
  }

  getConnectedUsers(room: string): User[]{
    return this.connectedUsers.filter((user) => user.room === room);
  }

  getAllConnectedUsers(): User[]{
    return this.connectedUsers;
  }

  checkForExistingUser(username: String): boolean{

    if(this.connectedUsers.find(u => u.username.toLocaleLowerCase() === username.toLocaleLowerCase())){
      return true;
    }
    return false;
  }

  getUserByClient(id: string): User{
    return this.connectedUsers.find(user => user.id === id);
  }

  getActiveUsersCount(): number{
    return this.connectedUsers.length;
  }

}
