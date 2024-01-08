import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
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
      cpf: CPF.create(generateFakeCPF()),
      name: faker.person.firstName(),
      password: faker.internet.password(),
      addressId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  );

  return deliveryPerson;
}
