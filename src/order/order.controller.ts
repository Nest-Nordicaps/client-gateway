import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrderController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  findAll() {
    try {
      return this.client.send({ cmd: 'find_all_orders' }, {});
      // const order = await firstValueFrom(
      //   this.orderClient.send({ cmd: 'find_all_orders' }, {}),
      // ); // El firstValueFrom convierte el Observable en una promesa y espera su resolucion
      // return order;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  @Get('id/:id')
  async findOne(id: number) {
    return this.client.send({ cmd: 'find_one_order' }, { id });
  }

  @Patch(':id')
  updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.client.send(
        { cmd: 'update_order' },
        {
          id,
          status: statusDto.status,
        },
      );
    } catch (error) {
      throw new Error(`Error updating order status : ${error.message}`);
    }
  }
}
