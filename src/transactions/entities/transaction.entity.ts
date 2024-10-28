import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client)
  client: Client;

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  token: string;

  @Column()
  sessionId: string;

  @Column({ default: false })
  confirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
