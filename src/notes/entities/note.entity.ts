import { Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 255})
  text: string;

  @Column({type: 'varchar', length: 50})
  to: string;

  @Column({type: 'varchar', length: 50})
  from: string;

  @Column({default: false})
  read: boolean;

  @Column()
  date: Date;

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;
}
