import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { OrderAddressRepository } from '@/domain/delivery/application/repositories/order-address-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';

export class InMemoryOrderAddressRepository implements OrderAddressRepository {
  public items: OrderAddress[] = [];

  async create(orderAddress: OrderAddress) {
    this.items.push(orderAddress);

    DomainEvents.dispatchEventsForAggregate(orderAddress.orderId);
  }

  async findById(id: string) {
    const orderaddress = this.items.find((item) => item.id.toString() === id);

    if (!orderaddress) {
      return null;
    }

    return orderaddress;
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    const newItemsList = this.items.filter(
      (item) => item.orderId.toString() !== orderId,
    );

    this.items = newItemsList;
  }

  async findManyOrdersByOrder(order: Order, { page }: PaginationParams) {
    const orderAddressList = this.items
      .filter((item) => item.orderId.equals(order.id))
      .slice((page - 1) * 20, page * 20);

    return orderAddressList;
  }
}
