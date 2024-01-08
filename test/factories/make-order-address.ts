import {
  OrderAddress,
  OrderAddressProps,
} from '@/domain/delivery/enterprise/entities/order-address';
import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
export function makeOrderAddress(
  override: Partial<OrderAddressProps> = {},
  id?: UniqueEntityID,
) {
  const orderAddress = OrderAddress.create(
    {
      cep: faker.location.zipCode(),
      city: faker.location.zipCode(),
      district: faker.location.city(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      number: faker.location.buildingNumber(),
      state: faker.location.state(),
      complement: faker.location.state(),
      street: faker.location.street(),
      orderId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  );

  return orderAddress;
}
