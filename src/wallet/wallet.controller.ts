import { Controller, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { LoadWalletDto } from './dto/load-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('load')
  async loadWallet(@Body() loadWalletDto: LoadWalletDto) {
    return this.walletService.loadWallet(loadWalletDto);
  }

  @Post('balance')
  async getBalance(@Body() balanceDto: any) {
    return this.walletService.getBalance(balanceDto.document, balanceDto.phone);
  }
}
