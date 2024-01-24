import {
  DeliveryPersonAddress,
  DeliveryPersonAddressProps,
} from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { PrismaDeliveryPersonAddressRepositoryMapper } from '@/infra/database/prisma/mappers/prisma-delivery-person-address-repository-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
export function makeDeliveryPersonAddress(
  override: Partial<DeliveryPersonAddressProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryPerson = DeliveryPersonAddress.create(
    {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      deliveryPersonId: new UniqueEntityID(faker.string.uuid()),
      ...override,
    },
    id,
  );

  return deliveryPerson;
}

@Injectable()
export class DeliveryPersonAddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryPersonAddress(
    data: Partial<DeliveryPersonAddressProps> = {},
  ): Promise<DeliveryPersonAddress> {
    const deliverypersonAddress = makeDeliveryPersonAddress(data);

    await this.prisma.address.create({
      data: PrismaDeliveryPersonAddressRepositoryMapper.toPrisma(
        deliverypersonAddress,
      ),
    });

    return deliverypersonAddress;
  }
}
