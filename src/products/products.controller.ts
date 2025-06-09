import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';

import { PRODUCT_SERVICE } from '../config/service';
import { ClientProxy } from '@nestjs/microservices';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

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
  //TODO: Corregir el tipo de retorno a number
  findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find_product' }, { id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    // return this.productsService.update(+id, updateProductDto);
    return this.productsClient.send(
      { cmd: 'update_product' },
      { id, ...updateProductDto },
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.productsService.remove(+id);
    return `This action removes a #${id} product`;
  }
}
