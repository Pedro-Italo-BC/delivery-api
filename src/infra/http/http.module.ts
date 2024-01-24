import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RegisterDeliveryPersonController } from './controllers/register-delivery-person.controller';
import { RegisterDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/register-delivery-person';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthModule } from '../auth/auth.module';
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { RegisterAdminController } from './controllers/register-admin.controller';
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller';
import { AuthenticateDeliveryPersonController } from './controllers/authenticate-delivery-person.controller';
import { AuthenticateDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-person';
import { CreateOrderController } from './controllers/create-order.controller';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order';
import { PickUpOrderController } from './controllers/pick-up-order.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    RegisterDeliveryPersonController,
    RegisterAdminController,
    AuthenticateAdminController,
    AuthenticateDeliveryPersonController,
    CreateOrderController,
    PickUpOrderController,
  ],
  providers: [
    RegisterDeliveryPersonUseCase,
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    AuthenticateDeliveryPersonUseCase,
    CreateOrderUseCase,
    PickUpOrderUseCase,
  ],
})
export class HttpModule {}
