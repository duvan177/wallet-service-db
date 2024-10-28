import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  document: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @OneToOne(() => Wallet, (wallet) => wallet.client)
  wallet: Wallet;
}
