import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProductsController],
  imports: [NatsModule],
})
export class ProductsModule {}

// ClientsModule.register([
//   {
//     name: PRODUCT_SERVICE,
//     transport: Transport.TCP,
//     options: {
//       host: envs.productsMicroserviceHost,
//       port: envs.productsMicroservicePort,
//     },
//   },
// ]),
