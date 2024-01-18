import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { PrismaService } from '../prisma.service';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { Order } from '@/domain/delivery/enterprise/entities/order';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';
import { OrderAddressRepository } from '@/domain/delivery/application/repositories/order-address-repository';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { Order as PrismaOrder } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(
    private prisma: PrismaService,
    private orderAddressRepository: OrderAddressRepository,
  ) {}

  async create({
    currentAddress,
    deliveryAddress,
    order,
  }: {
    order: Order;
    currentAddress: OrderAddress;
    deliveryAddress: OrderAddress;
  }): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    Promise.all([
      await this.prisma.order.create({ data }),
      await this.orderAddressRepository.create(currentAddress),
      await this.orderAddressRepository.create(deliveryAddress),
    ]);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data,
    });
  }

  async delete(order: Order): Promise<void> {
    Promise.all([
      await this.prisma.order.delete({
        where: {
          id: order.id.toString(),
        },
      }),
      await this.orderAddressRepository.deleteManyByOrderId(
        order.id.toString(),
      ),
    ]);
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    return order ? PrismaOrderMapper.toDomain(order) : null;
  }

  async findManyNearToDeliveryPersonAddress(
    deliveryPersonAddress: DeliveryPersonAddress,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const distaceInMeters = 5000; // 5 Km

    //  This piece of code gets the deliveryPerson Coordinates by a JOIN.
    //     WITH user_location AS (
    //     SELECT address.latitude, address.longitude
    //     FROM users
    //     JOIN addresses AS address ON users.address_id = address.id
    //     WHERE users.id = ${deliveryPersonAddress.id.toString()}
    // )

    //  And this piece gets all the orders where status is "WAITING" and deliveryPersonId is null, then using the function ST_DWithin the two addresses coordinates are compared returning the order that are 5 Km away from the deliveryPerson.
    //
    // SELECT *
    // FROM orders
    // WHERE status = 'WAITING'
    // AND delivery_person_id IS NULL
    // AND ST_DWithin(
    // ST_MakePoint((SELECT longitude FROM user_location), (SELECT latitude FROM user_location))::geography,
    // ST_MakePoint(orders.current_address.longitude, orders.current_address.latitude)::geography,
    // ${distaceInMeters}
    //)

    const nearOrders: PrismaOrder[] = await this.prisma
      .$queryRaw`WITH user_location AS (
      SELECT address.latitude, address.longitude
      FROM users
      JOIN addresses AS address ON users.address_id = address.id
      WHERE users.id = ${deliveryPersonAddress.id.toString()}
  )
  SELECT *
  FROM orders
  WHERE status = 'WAITING'
    AND delivery_person_id IS NULL
    AND ST_DWithin(
      ST_MakePoint((SELECT longitude FROM user_location), (SELECT latitude FROM user_location))::geography,
      ST_MakePoint(orders.current_address.longitude, orders.current_address.latitude)::geography,
      ${distaceInMeters}
    )
  LIMIT ${page * 20}
  OFFSET ${(page - 1) * 20}
  `;

    return nearOrders.map(PrismaOrderMapper.toDomain);
  }

  async findManyDeliveredOrdersByDeliveryPerson(
    deliveryPerson: DeliveryPerson,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const deliveredOrders = await this.prisma.order.findMany({
      where: {
        deliveryPersonId: deliveryPerson.id.toString(),
        status: 'DELIVERED',
      },

      take: page * 20,
      skip: (page - 1) * 20,
    });

    return deliveredOrders.map(PrismaOrderMapper.toDomain);
  }
}
