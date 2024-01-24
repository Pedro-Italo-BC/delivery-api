import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order';
import { OrderState } from '@/domain/delivery/enterprise/entities/value-object/order-state';
import { PrismaOrderRepositoryMapper } from '@/infra/database/prisma/mappers/prisma-order-repository-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      currentAddressId: new UniqueEntityID(faker.string.uuid()),
      deliveryAddressId: new UniqueEntityID(faker.string.uuid()),
      content: faker.lorem.text(),
      title: faker.lorem.word(),
      deliveryPersonId: new UniqueEntityID(faker.string.uuid()),
      status: OrderState.create('WAITING'),
      receiverPersonId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  );

  return order;
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data);

    await this.prisma.order.create({
      data: PrismaOrderRepositoryMapper.toPrisma(order),
    });

    return order;
  }
}
