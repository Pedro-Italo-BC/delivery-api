import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';

import { Prisma, Address as PrismaDeliveryPersonAddress } from '@prisma/client';

export class PrismaDeliveryPersonAddressMapper {
  static toPrisma(
    deliveryPersonAddress: DeliveryPersonAddress,
  ): Prisma.AddressUncheckedCreateInput {
    return {
      cep: deliveryPersonAddress.cep,
      city: deliveryPersonAddress.city,
      district: deliveryPersonAddress.district,
      latitude: deliveryPersonAddress.latitude,
      longitude: deliveryPersonAddress.longitude,
      number: deliveryPersonAddress.number,
      state: deliveryPersonAddress.state,
      street: deliveryPersonAddress.street,
      complement: deliveryPersonAddress.complement,
      deliveryPersonId: deliveryPersonAddress.deliveryPersonId.toString(),
    };
  }

  static toDomain(raw: PrismaDeliveryPersonAddress): DeliveryPersonAddress {
    if (!raw.deliveryPersonId) {
      throw new Error('Delivery-Person ID was not provided');
    }

    return DeliveryPersonAddress.create({
      cep: raw.cep,
      city: raw.city,
      deliveryPersonId: new UniqueEntityID(raw.deliveryPersonId),
      district: raw.district,
      latitude: raw.latitude,
      longitude: raw.longitude,
      number: raw.number,
      state: raw.state,
      street: raw.street,
      complement: raw.complement,
      createdAt: raw.createdAt,
    });
  }
}
