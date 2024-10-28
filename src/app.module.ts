import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ConfigModule } from '@nestjs/config';
console.log(process.env.DB_HOST);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      migrationsRun: false,
      migrations: ['src/migrations/*{.ts,.js}'],
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ClientsModule,
    WalletModule,
    TransactionsModule,
  ],
})
export class AppModule {
  constructor() {
    console.log(process.env.DB_HOST);
  }
}
