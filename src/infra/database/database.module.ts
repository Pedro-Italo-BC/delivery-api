import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { PrismaAdminRepository } from './prisma/repositories/prisma-admin-repository';
import { DeliveryPersonRepository } from '@/domain/delivery/application/repositories/delivery-person-repository';
import { PrismaDeliveryPersonRepository } from './prisma/repositories/prisma-delivery-person-repository';
import { DeliveryPersonAddressRepository } from '@/domain/delivery/application/repositories/delivery-person-address-repository';
import { PrismaDeliveryPersonAddressRepository } from './prisma/repositories/prisma-delivery-person-address-repository';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository';
import { OrderAddressRepository } from '@/domain/delivery/application/repositories/order-address-repository';
import { PrismaOrderAddressRepository } from './prisma/repositories/prisma-order-address-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminRepository,
      useClass: PrismaAdminRepository,
    },
    {
      provide: DeliveryPersonRepository,
      useClass: PrismaDeliveryPersonRepository,
    },
    {
      provide: DeliveryPersonAddressRepository,
      useClass: PrismaDeliveryPersonAddressRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: OrderAddressRepository,
      useClass: PrismaOrderAddressRepository,
    },
  ],
  exports: [
    AdminRepository,
    DeliveryPersonRepository,
    DeliveryPersonAddressRepository,
    OrderRepository,
    OrderAddressRepository,
  ],
})
export class DatabaseModule {}
