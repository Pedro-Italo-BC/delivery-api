import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order';
import { OrderState } from '@/domain/delivery/enterprise/entities/value-object/order-state';
import { faker } from '@faker-js/faker';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      addressId: new UniqueEntityID(faker.string.uuid()),
      content: faker.lorem.text(),
      title: faker.lorem.word(),
      deliveryPersonId: new UniqueEntityID(faker.string.uuid()),
      status: OrderState.create('WAITING'),
      ...override,
    },
    id,
  );

  return order;
}
