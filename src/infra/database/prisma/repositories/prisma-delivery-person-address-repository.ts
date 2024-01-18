import { DeliveryPersonAddressRepository } from '@/domain/delivery/application/repositories/delivery-person-address-repository';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { PrismaService } from '../prisma.service';
import { PrismaDeliveryPersonAddressMapper } from '../mappers/prisma-order-address-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDeliveryPersonAddressRepository
  implements DeliveryPersonAddressRepository
{
  constructor(private prisma: PrismaService) {}

  async create(address: DeliveryPersonAddress): Promise<void> {
    const data = PrismaDeliveryPersonAddressMapper.toPrisma(address);

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
      ? PrismaDeliveryPersonAddressMapper.toDomain(deliveryPersonAddress)
      : null;
  }
}
