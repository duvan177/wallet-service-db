import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class LoadWalletDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
