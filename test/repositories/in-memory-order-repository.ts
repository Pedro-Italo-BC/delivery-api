import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';
import { InMemoryOrderAddressRepository } from './in-memory-order-address-repository';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { getAddressDistance } from 'test/utils/get-address-distance';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person';
import { DomainEvents } from '@/core/events/domain-events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  constructor(
    private inMemoryOrderAddressRepository: InMemoryOrderAddressRepository,
  ) {}

  async create({
    order,
    currentAddress,
    deliveryAddress,
  }: {
    order: Order;
    currentAddress: OrderAddress;
    deliveryAddress: OrderAddress;
  }): Promise<void> {
    this.items.push(order);
    await this.inMemoryOrderAddressRepository.save(currentAddress);
    await this.inMemoryOrderAddressRepository.save(deliveryAddress);

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(order.id));

    if (itemIndex === -1) {
      return;
    }

    this.items[itemIndex] = order;

    DomainEvents.dispatchEventsForAggregate(order.id);
  }

  async delete(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id);

    this.items.splice(itemIndex, 1);

    this.inMemoryOrderAddressRepository.deleteManyByOrderId(
      order.id.toString(),
    );
  }
  async findManyNearToDeliveryPersonAddress(
    deliveryPersonAddress: DeliveryPersonAddress,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const nearOrdersAddress = this.inMemoryOrderAddressRepository.items.filter(
      (item) => {
        const deliveryPersonCoordinates = {
          latitude: deliveryPersonAddress.latitude,
          longitude: deliveryPersonAddress.longitude,
        };

        const itemCoordinates = {
          latitude: item.latitude,
          longitude: item.longitude,
        };

        const distanceInKm = getAddressDistance(
          deliveryPersonCoordinates,
          itemCoordinates,
        );

        return distanceInKm <= 5000; // 5km
      },
    );

    const orders = this.items
      .filter((item) => {
        return nearOrdersAddress.some((itemAddress) =>
          itemAddress.id.equals(item.currentAddressId),
        );
      })
      .slice((page - 1) * 20, page * 20);

    return orders;
  }

  async findManyDeliveredOrdersByDeliveryPerson(
    deliveryPerson: DeliveryPerson,
    { page }: PaginationParams,
  ) {
    const orders = this.items
      .filter((item) => {
        return (
          item.deliveryPersonId?.equals(deliveryPerson.id) &&
          item.status === 'DELIVERED'
        );
      })
      .slice((page - 1) * 20, page * 20);

    return orders;
  }
}
