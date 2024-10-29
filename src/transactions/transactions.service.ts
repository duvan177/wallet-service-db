import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';
import { ClientsService } from '../clients/clients.service';
import { WalletService } from '../wallet/wallet.service';
import { MakePurchaseDto } from './dto/make-purchase.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private clientsService: ClientsService,
    private walletService: WalletService,
  ) {}

  async makePurchase(purchaseDto: MakePurchaseDto): Promise<any> {
    const { document, phone, amount } = purchaseDto;

    const client = await this.clientsService.findByDocumentAndPhone(
      document,
      phone,
    );

    if (!client) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    const wallet = await this.walletService.getBalance(document, phone);

    if (wallet.data.balance < amount) {
      throw new BadRequestException('Saldo insuficiente.');
    }

    const token = crypto.randomInt(100000, 999999).toString();
    const sessionId = uuidv4();

    const transaction = this.transactionRepository.create({
      client,
      amount,
      token,
      sessionId,
    });

    await this.transactionRepository.save(transaction);

    // Enviar email con el token
    await this.sendEmailToken(client.email, token);

    return {
      codigo: 0,
      mensaje:
        'Compra iniciada. Se ha enviado un correo con el token de confirmación.',
      data: {
        sessionId,
      },
    };
  }

  async confirmPayment(confirmDto: ConfirmPaymentDto): Promise<any> {
    const { sessionId, token } = confirmDto;
    if(!sessionId || !token){
      throw new BadRequestException('Token o sesión inválidos.');
    }
    
    const transaction = await this.transactionRepository.findOne({
      where: { sessionId, token, confirmed: false },
      relations: ['client'],
    });

    if (!transaction) {
      throw new BadRequestException('Token o sesión inválidos.');
    }

    // Validar expiración del token (por ejemplo, 10 minutos)
    const now = new Date();
    const diff = (now.getTime() - transaction.createdAt.getTime()) / 1000 / 60; // Diferencia en minutos
    if (diff > 10) {
      throw new BadRequestException('El token ha expirado.');
    }

    // Descontar el saldo
    await this.walletService.debitWallet(
      transaction.client,
      transaction.amount,
    );

    transaction.confirmed = true;
    await this.transactionRepository.save(transaction);

    return {
      codigo: 0,
      mensaje: 'Pago confirmado exitosamente.',
    };
  }

  private async sendEmailToken(email: string, token: string) {
    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      // Configurar con tu proveedor de email
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER || 'duvannarvaez17@gmail.com',
        pass: process.env.EMAIL_PASS || "puvc xjvy lpha ssgr",
      },
    });

    // Enviar email
    await transporter.sendMail({
      from: '"Billetera Virtual" <no-reply@example.com>',
      to: email,
      subject: 'Token de Confirmación',
      text: `Su token de confirmación es: ${token}`,
    });
  }
}
