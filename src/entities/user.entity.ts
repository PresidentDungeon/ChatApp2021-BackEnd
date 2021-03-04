import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import MessageEntity from "./message.entity";
import { User } from "../chat/core/models/user";

@Entity()
class UserEntity {
  @PrimaryColumn()
  public id: string;

  @Column()
  public username: string;

  @Column()
  public room: string;

  @Column({default: false})
  public isTyping: boolean;

}

export default UserEntity;


