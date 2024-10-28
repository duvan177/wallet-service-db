import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { MakePurchaseDto } from './dto/make-purchase.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('purchase')
  async makePurchase(@Body() purchaseDto: MakePurchaseDto) {
    return this.transactionsService.makePurchase(purchaseDto);
  }

  @Post('confirm')
  async confirmPayment(@Body() confirmDto: ConfirmPaymentDto) {
    return this.transactionsService.confirmPayment(confirmDto);
  }
}
