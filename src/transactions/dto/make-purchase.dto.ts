import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class MakePurchaseDto {
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
