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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config';
import { StatusDto } from './dto/status.dto';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Controller('orders')
export class OrderController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    // Recibe los datos de la peticion por query
    try {
      // return this.client.send({ cmd: 'find_all_orders' }, { paginationDto });
      const orders = await firstValueFrom(
        this.client.send({ cmd: 'find_all_orders' }, orderPaginationDto),
      ); // El firstValueFrom convierte el Observable en una promesa y espera su resolucion

      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send({ cmd: 'find_one_order' }, { id }),
      );

      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // TODO: REFACTOR: Cambiar a 'change_order_status'
  @Patch(':id')
  changeStaus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.client.send(
        { cmd: 'change_order_status' },
        {
          id,
          status: statusDto.status,
        },
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
