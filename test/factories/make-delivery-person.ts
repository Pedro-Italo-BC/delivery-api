import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { PrismaDeliveryPersonRepositoryMapper } from '@/infra/database/prisma/mappers/prisma-delivery-person-repository-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  DeliveryPerson,
  DeliveryPersonProps,
} from 'src/domain/delivery/enterprise/entities/delivery-person';
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

@Injectable()
export class DeliveryPersonFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryPerson(
    data: Partial<DeliveryPersonProps> = {},
  ): Promise<DeliveryPerson> {
    const deliveryperson = makeDeliveryPerson(data);

    await this.prisma.user.create({
      data: PrismaDeliveryPersonRepositoryMapper.toPrisma(deliveryperson),
    });

    return deliveryperson;
  }
}
