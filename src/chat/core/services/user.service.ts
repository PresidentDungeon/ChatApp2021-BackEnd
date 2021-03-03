import { Injectable } from '@nestjs/common';
import { User } from "../models/user";
import { IUserService } from "../primary-ports/user.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import UserEntity from "../../infrastructure/data-source/entities/user.entity";

@Injectable()
export class UserService implements IUserService{

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async registerUser(userToRegister: User): Promise<boolean>{

    const user = await this.userRepository.findOne({ where: `"username" ILIKE '${userToRegister.username}' AND "room" ILIKE '${userToRegister.room}'`});
    if(user){return false;}

    else{
      const newUser = await this.userRepository.create(userToRegister);
      await this.userRepository.save(newUser);
      return true;
    }
  }

  async unregisterUser(id: string): Promise<any>{
    const user = await this.userRepository.findOne({ where: { id: id }});
    const deleteResponse = await this.userRepository.delete(id);

    if(deleteResponse.affected){return {removed: true, user: user};}
    return {removed: false, user: null};
  }

  async unregisterAllUsersByClient(id: string): Promise<any>{
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (user) {const deleteResponse = await this.userRepository.delete({id: id}); if(deleteResponse.affected){return {removed: true, user: user};}}
    return {removed: false, user: null};
  }

  async addTypingUser(user: User){
    const result = await this.userRepository.createQueryBuilder().update(UserEntity)
      .set({ isTyping: true})
      .where({ id: user.id })
      .execute();

    return true;
  }

  async removeTypingUser(id: string): Promise<boolean>{

    const users = await this.userRepository.count({where: {id: id, isTyping: true}});

    if(users > 0){
        await this.userRepository.createQueryBuilder().update(UserEntity)
        .set({ isTyping: false})
        .where({ id: id })
        .execute();

      return true;
    }
    return false;
  }

  async getRecentTypingUsers(room: string): Promise<User[]>{

    const maxTakeAmount = 5;

    const result: User[] = await this.userRepository.find(
      {
        where: {isTyping: true, room: room},
        take: maxTakeAmount
      }
    );

    return result;
  }

  async getConnectedUsers(room: string): Promise<User[]>{
    const connectedUsers: User[] = await this.userRepository.find({where: `"room" ILIKE '${room}'`});
    return connectedUsers;
  }

  async getAllConnectedUsers(): Promise<User[]>{
    const allConnectedUsers: User[] = await this.userRepository.find();
    return allConnectedUsers;
  }

  async checkForExistingUser(username: String): Promise<boolean>{
    const user = await this.userRepository.findOne({ where: `"username" ILIKE '${username}'`});
    if(user){return true;}
    return false;
  }

  async getUserByClient(id: string): Promise<User>{
    const user = await this.userRepository.findOne({ where: {id: id}});
    return user;
  }

  async getActiveUsersCount(): Promise<number>{

    const onlineAmount: number = await this.userRepository.count();
    return onlineAmount;
  }

}
