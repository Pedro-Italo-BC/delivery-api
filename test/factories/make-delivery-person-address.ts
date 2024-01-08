import {
  DeliveryPersonAddress,
  DeliveryPersonAddressProps,
} from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
export function makeDeliveryPersonAddress(
  override: Partial<DeliveryPersonAddressProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryPerson = DeliveryPersonAddress.create(
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
      deliveryPersonId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  );

  return deliveryPerson;
}
