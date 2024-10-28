import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<any> {
    const { document, email } = createClientDto;

    const existingClient = await this.clientRepository.findOne({
      where: [{ document }, { email }],
    });

    if (existingClient) {
      throw new BadRequestException('Cliente ya registrado.');
    }

    const client = this.clientRepository.create(createClientDto);
    await this.clientRepository.save(client);

    return {
      codigo: 0,
      mensaje: 'Cliente registrado exitosamente.',
    };
  }

  async findByDocumentAndPhone(
    document: string,
    phone: string,
  ): Promise<Client> {
    return this.clientRepository.findOne({ where: { document, phone } });
  }

}
