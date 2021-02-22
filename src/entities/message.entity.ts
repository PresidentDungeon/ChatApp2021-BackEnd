import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../chat/core/models/user";
import UserEntity from "./user.entity";

@Entity()
class MessageEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index()
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.messages)
  public user: UserEntity;

  @Column()
  public timestamp: Date;

  @Column()
  public isSystemInfo: boolean;
}

export default MessageEntity;


