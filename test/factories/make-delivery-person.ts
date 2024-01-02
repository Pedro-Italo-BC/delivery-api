import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { DeliveryPerson } from 'src/domain/delivery/enterprise/entities/delivery-person';
import { generateFakeCPF } from 'test/utils/generate-fake-cpf';

export function makeDeliveryPerson(
  override: Partial<DeliveryPerson> = {},
  id?: UniqueEntityID,
) {
  const deliveryPerson = DeliveryPerson.create(
    {
      cpf: generateFakeCPF(),
      name: faker.person.firstName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return deliveryPerson;
}
