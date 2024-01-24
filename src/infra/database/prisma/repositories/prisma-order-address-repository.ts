import { OrderAddressRepository } from '@/domain/delivery/application/repositories/order-address-repository';
import { PrismaOrderAddressRepositoryMapper } from '../mappers/prisma-order-address-repository-mapper';
import { PrismaService } from '../prisma.service';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '@/domain/delivery/enterprise/entities/order';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaOrderAddressRepository implements OrderAddressRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: OrderAddress): Promise<void> {
    const data = PrismaOrderAddressRepositoryMapper.toPrisma(address);

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
      ? PrismaOrderAddressRepositoryMapper.toDomain(orderAddress)
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

    return orderAddress.map(PrismaOrderAddressRepositoryMapper.toDomain);
  }

  async save(address: OrderAddress): Promise<void> {
    const data = PrismaOrderAddressRepositoryMapper.toPrisma(address);

    await this.prisma.address.update({
      where: {
        id: address.id.toString(),
      },
      data,
    });
  }
}
