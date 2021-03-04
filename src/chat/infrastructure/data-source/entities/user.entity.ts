import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryColumn()
  public id: string;

  @Column()
  public username: string;

  @Column()
  public room: string;

  @Column({default: false})
  public isTyping: boolean;

}


