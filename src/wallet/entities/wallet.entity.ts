
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @OneToOne(() => Client, (client) => client.wallet)
  @JoinColumn()
  client: Client;
}
