import { OrderAddressRepository } from '@/domain/delivery/application/repositories/order-address-repository';
import { PrismaOrderAddressMapper } from '../mappers/prisma-delivery-person-address-mapper';
import { PrismaService } from '../prisma.service';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '@/domain/delivery/enterprise/entities/order';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaOrderAddressRepository implements OrderAddressRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: OrderAddress): Promise<void> {
    const data = PrismaOrderAddressMapper.toPrisma(address);

    await this.prisma.address.create({
      data,
    });
  }
  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.prisma.address.deleteMany({
      where: {
        orderId,
      },
    });
  }
  async findById(id: string): Promise<OrderAddress | null> {
    const orderAddress = await this.prisma.address.findUnique({
      where: {
        id,
      },
    });

    return orderAddress
      ? PrismaOrderAddressMapper.toDomain(orderAddress)
      : null;
  }

  async findManyOrdersAddressByOrder(
    order: Order,
    { page }: PaginationParams,
  ): Promise<OrderAddress[]> {
    const orderAddress = await this.prisma.address.findMany({
      where: {
        orderId: order.id.toString(),
      },
      skip: (page - 1) * 20,
      take: page * 20,
    });

    return orderAddress.map(PrismaOrderAddressMapper.toDomain);
  }
}
