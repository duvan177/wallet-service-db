import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from './entities/wallet.entity';
import { ClientsService } from '../clients/clients.service';
import { LoadWalletDto } from './dto/load-wallet.dto';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private clientsService: ClientsService,
  ) {}

  async loadWallet(loadWalletDto: LoadWalletDto): Promise<any> {
    const { document, phone, amount } = loadWalletDto;

    const client = await this.clientsService.findByDocumentAndPhone(
      document,
      phone,
    );

    if (!client) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    let wallet = await this.walletRepository.findOne({ where: { client } });

    if (!wallet) {
      wallet = this.walletRepository.create({ client, balance: 0 });
    }

    wallet.balance = Number(wallet.balance) + amount;
    await this.walletRepository.save(wallet);

    return {
      codigo: 0,
      mensaje: 'Billetera recargada exitosamente.',
    };
  }

  async getBalance(document: string, phone: string): Promise<any> {
    const client = await this.clientsService.findByDocumentAndPhone(
      document,
      phone,
    );

    if (!client) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    const wallet = await this.walletRepository.findOne({ where: { client } });

    return {
      codigo: 0,
      mensaje: 'Consulta exitosa.',
      data: {
        balance: wallet ? Number(wallet.balance) : 0,
      },
    };
  }

  async debitWallet(client: Client, amount: number): Promise<void> {
    const wallet = await this.walletRepository.findOne({ where: { client } });

    if (!wallet || Number(wallet.balance) < amount) {
      throw new NotFoundException('Saldo insuficiente.');
    }

    wallet.balance = Number(wallet.balance) - amount;
    await this.walletRepository.save(wallet);
  }

}
