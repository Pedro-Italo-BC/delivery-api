import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';

import { Prisma, Address as PrismaOrderAddress } from '@prisma/client';

export class PrismaOrderAddressRepositoryMapper {
  static toPrisma(
    orderAddress: OrderAddress,
  ): Prisma.AddressUncheckedCreateInput {
    return {
      latitude: orderAddress.latitude,
      longitude: orderAddress.longitude,
      orderId: orderAddress.orderId.toString(),
      id: orderAddress.id.toString(),
      createdAt: orderAddress.createdAt,
    };
  }

  static toDomain(raw: PrismaOrderAddress): OrderAddress {
    if (!raw.orderId) {
      throw new Error('Delivery-Person ID was not provided');
    }

    return OrderAddress.create(
      {
        latitude: raw.latitude,
        longitude: raw.longitude,
        createdAt: raw.createdAt,

        orderId: new UniqueEntityID(raw.orderId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
