import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { NatsModule } from './transports/nats.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ProductsModule, NatsModule, OrderModule],
})
export class AppModule {}
