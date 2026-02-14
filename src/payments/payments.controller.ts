import { Controller, Get, Post, Body, Param, Inject } from '@nestjs/common';
import { PaymentSessionDto } from './dto/session-payment.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    try {
      return this.client.send(
        { cmd: 'create_payment_session' },
        paymentSessionDto,
      );
    } catch (error) {
      throw new Error(`Error creating payment session: ${error.message}`);
    }
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  
}
