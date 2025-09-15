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
import { PaginationDto } from 'src/common/pagination.dto';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrderController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send({ cmd: 'create_order' }, createOrderDto);
  }

  @Get() //TODO: Seguir con el servicio en Order-ms
  async findAll(@Query() paginationDto: PaginationDto) {
    // Recibe los datos de la peticion por query
    try {
      // return this.client.send({ cmd: 'find_all_orders' }, { paginationDto });
      const orders = await firstValueFrom(
        this.client.send({ cmd: 'find_all_orders' }, { paginationDto }),
      ); // El firstValueFrom convierte el Observable en una promesa y espera su resolucion

      return orders;
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
