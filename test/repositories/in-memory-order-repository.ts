import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = [];

  async create(order: Order) {
    this.items.push(order);
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
  }

  async delete(order: Order): Promise<void> {
    const newList = this.items.filter((item) => !item.id.equals(order.id));

    this.items = newList;
  }
}
