import { DeliveryPersonAddressRepository } from '@/domain/delivery/application/repositories/delivery-person-address-repository';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { PrismaService } from '../prisma.service';
import { PrismaDeliveryPersonAddressRepositoryMapper } from '../mappers/prisma-delivery-person-address-repository-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDeliveryPersonAddressRepository
  implements DeliveryPersonAddressRepository
{
  constructor(private prisma: PrismaService) {}

  async create(address: DeliveryPersonAddress): Promise<void> {
    const data = PrismaDeliveryPersonAddressRepositoryMapper.toPrisma(address);

    await this.prisma.address.create({
      data,
    });
  }
  async deleteManyByDeliveryPersonId(deliveryPersonId: string): Promise<void> {
    await this.prisma.address.deleteMany({
      where: {
        deliveryPersonId,
      },
    });
  }
  async findById(id: string): Promise<DeliveryPersonAddress | null> {
    const deliveryPersonAddress = await this.prisma.address.findUnique({
      where: {
        id,
      },
    });

    return deliveryPersonAddress
      ? PrismaDeliveryPersonAddressRepositoryMapper.toDomain(
          deliveryPersonAddress,
        )
      : null;
  }

  async save(address: DeliveryPersonAddress): Promise<void> {
    const data = PrismaDeliveryPersonAddressRepositoryMapper.toPrisma(address);

    await this.prisma.address.update({
      where: {
        id: address.id.toString(),
      },
      data,
    });
  }
}
