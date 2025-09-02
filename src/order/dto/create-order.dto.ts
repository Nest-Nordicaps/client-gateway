import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrderItemsDto } from './order-items.dto';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1) // Asegura que el array tenga al menos un elemento
  @ValidateNested({ each: true }) // Valida cada elemento del array
  @Type(() => OrderItemsDto) // Transforma cada elemento del array a una instancia de OrderItemsDto
  items: OrderItemsDto[];
}
