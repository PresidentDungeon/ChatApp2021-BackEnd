import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import MessageEntity from "./message.entity";

@Entity()
class UserEntity {
  @PrimaryColumn()
  public id: string;

  @Column()
  public username: string;

  @Column()
  public room: string;

  @OneToMany(() => MessageEntity, (messageEntity: MessageEntity) => messageEntity.user)
  public messages?: MessageEntity[];
}

export default UserEntity;


