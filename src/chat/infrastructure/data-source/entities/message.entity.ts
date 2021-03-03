import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../core/models/user";
import UserEntity from "./user.entity";

@Entity()
class MessageEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  message: string;

  @Column()
  public user: string;

  @Column()
  public room: string;

  @Column()
  public timestamp: Date;

  @Column()
  public isSystemInfo: boolean;
}

export default MessageEntity;


