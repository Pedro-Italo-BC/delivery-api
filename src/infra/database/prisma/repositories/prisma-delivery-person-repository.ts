import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DeliveryPersonRepository } from '@/domain/delivery/application/repositories/delivery-person-repository';
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { DeliveryPersonAddressRepository } from '@/domain/delivery/application/repositories/delivery-person-address-repository';
import { PrismaDeliveryPersonRepositoryMapper } from '../mappers/prisma-delivery-person-repository-mapper';

@Injectable()
export class PrismaDeliveryPersonRepository
  implements DeliveryPersonRepository
{
  constructor(
    private prisma: PrismaService,
    private deliveryPersonAddressRepository: DeliveryPersonAddressRepository,
  ) {}
  async create({
    deliveryPerson,
    deliveryPersonAddress,
  }: {
    deliveryPerson: DeliveryPerson;
    deliveryPersonAddress: DeliveryPersonAddress;
  }): Promise<void> {
    const data = PrismaDeliveryPersonRepositoryMapper.toPrisma(deliveryPerson);

    await this.prisma.user.create({
      data,
    });

    await this.deliveryPersonAddressRepository.save(deliveryPersonAddress);
  }
  async delete(deliveryPerson: DeliveryPerson): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: deliveryPerson.id.toString(),
      },
    });

    await this.deliveryPersonAddressRepository.deleteManyByDeliveryPersonId(
      deliveryPerson.id.toString(),
    );
  }
  async save({
    deliveryPerson,
    deliveryPersonAddress,
  }: {
    deliveryPerson: DeliveryPerson;
    deliveryPersonAddress?: DeliveryPersonAddress | undefined;
  }): Promise<void> {
    const data = PrismaDeliveryPersonRepositoryMapper.toPrisma(deliveryPerson);

    await this.prisma.user.update({
      where: {
        id: deliveryPerson.id.toString(),
      },
      data,
    });

    if (
      deliveryPersonAddress &&
      deliveryPersonAddress.id.equals(deliveryPerson.addressId)
    ) {
      await this.deliveryPersonAddressRepository.create(deliveryPersonAddress);
    }
  }

  async findById(id: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return deliveryPerson
      ? PrismaDeliveryPersonRepositoryMapper.toDomain(deliveryPerson)
      : null;
  }
  async findByCPF(cpf: CPF): Promise<DeliveryPerson | null> {
    const deliveryPerson = await this.prisma.user.findUnique({
      where: {
        cpf: cpf.value,
      },
    });

    return deliveryPerson
      ? PrismaDeliveryPersonRepositoryMapper.toDomain(deliveryPerson)
      : null;
  }
}
