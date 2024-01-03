import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  Address,
  AddressProps,
} from 'src/domain/delivery/enterprise/entities/address';

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID,
) {
  const address = Address.create(
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
      ...override,
    },
    id,
  );

  return address;
}
