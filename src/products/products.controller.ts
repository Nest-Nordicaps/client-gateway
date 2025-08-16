import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
} from '@nestjs/common';

import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly productsClient: ClientProxy,
  ) {} // TODO: Se agrego el proxy de NATS (PROBAR)

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }

  @Get()
  findAll() {
    return this.productsClient.send({ cmd: 'find_all_products' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsClient.send({ cmd: 'find_product' }, { id });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    // return this.productsService.update(+id, updateProductDto);
    return this.productsClient.send(
      { cmd: 'update_product' },
      { id, ...updateProductDto },
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    // return this.productsService.remove(+id);
    return this.productsClient.send({ cmd: 'remove_product' }, { id });
  }
}
