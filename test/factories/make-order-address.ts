import {
  OrderAddress,
  OrderAddressProps,
} from '@/domain/delivery/enterprise/entities/order-address';
import { PrismaOrderAddressRepositoryMapper } from '@/infra/database/prisma/mappers/prisma-order-address-repository-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
export function makeOrderAddress(
  override: Partial<OrderAddressProps> = {},
  id?: UniqueEntityID,
) {
  const orderAddress = OrderAddress.create(
    {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      orderId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  );

  return orderAddress;
}

@Injectable()
export class OrderAddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrderAddress(
    data: Partial<OrderAddressProps> = {},
  ): Promise<OrderAddress> {
    const orderAddress = makeOrderAddress(data);

    await this.prisma.address.create({
      data: PrismaOrderAddressRepositoryMapper.toPrisma(orderAddress),
    });

    return orderAddress;
  }
}
