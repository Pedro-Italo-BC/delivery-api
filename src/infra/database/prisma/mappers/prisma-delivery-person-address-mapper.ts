import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';

import { Prisma, Address as PrismaOrderAddress } from '@prisma/client';

export class PrismaOrderAddressMapper {
  static toPrisma(
    orderAddress: OrderAddress,
  ): Prisma.AddressUncheckedCreateInput {
    return {
      cep: orderAddress.cep,
      city: orderAddress.city,
      district: orderAddress.district,
      latitude: orderAddress.latitude,
      longitude: orderAddress.longitude,
      number: orderAddress.number,
      state: orderAddress.state,
      street: orderAddress.street,
      complement: orderAddress.complement,
      orderId: orderAddress.orderId.toString(),
    };
  }

  static toDomain(raw: PrismaOrderAddress): OrderAddress {
    if (!raw.orderId) {
      throw new Error('Delivery-Person ID was not provided');
    }

    return OrderAddress.create({
      cep: raw.cep,
      city: raw.city,
      orderId: new UniqueEntityID(raw.orderId),
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
