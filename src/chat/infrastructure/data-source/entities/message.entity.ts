import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageEntity {
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


