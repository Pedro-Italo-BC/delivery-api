import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';

import { Prisma, Address as PrismaDeliveryPersonAddress } from '@prisma/client';

export class PrismaDeliveryPersonAddressRepositoryMapper {
  static toPrisma(
    deliveryPersonAddress: DeliveryPersonAddress,
  ): Prisma.AddressUncheckedCreateInput {
    return {
      latitude: deliveryPersonAddress.latitude,
      longitude: deliveryPersonAddress.longitude,
      deliveryPersonId: deliveryPersonAddress.deliveryPersonId.toString(),
      createdAt: deliveryPersonAddress.createdAt,
      id: deliveryPersonAddress.id.toString(),
    };
  }

  static toDomain(raw: PrismaDeliveryPersonAddress): DeliveryPersonAddress {
    if (!raw.deliveryPersonId) {
      throw new Error('Delivery-Person ID was not provided');
    }

    return DeliveryPersonAddress.create(
      {
        deliveryPersonId: new UniqueEntityID(raw.deliveryPersonId),
        latitude: raw.latitude,
        longitude: raw.longitude,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
