import { faker } from '@faker-js/faker';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  Admin,
  AdminProps,
} from 'src/domain/delivery/enterprise/entities/admin';
import { generateFakeCPF } from 'test/utils/generate-fake-cpf';

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      cpf: generateFakeCPF(),
      name: faker.person.firstName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return admin;
}
