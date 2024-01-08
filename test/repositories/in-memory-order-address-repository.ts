import { OrderAddressRepository } from '@/domain/delivery/application/repositories/order-address-repository';
import { OrderAddress } from '@/domain/delivery/enterprise/entities/order-address';

export class InMemoryOrderAddressRepository implements OrderAddressRepository {
  public items: OrderAddress[] = [];

  async create(orderaddress: OrderAddress) {
    this.items.push(orderaddress);
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
}
