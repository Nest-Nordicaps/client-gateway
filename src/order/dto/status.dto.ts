import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enum/order.enum';

export class StatusDto {
  @IsOptional()
  @IsEnum(OrderStatusList, { message: `Valid status ar ${OrderStatusList}` }) // El @IsEnum valida que el valor este dentro del enum, en este caso OrderStatusList que es un array de los valores posibles
  status: OrderStatus; // Puede ser opcional para que no sea obligatorio enviarlo en la actualizacion
}
