import { Order } from '../../enterprise/entities/order';
import { OrderAddress } from '../../enterprise/entities/order-address';

export abstract class OrderRepository {
  abstract create(order: {
    order: Order;
    orderAddress: OrderAddress;
  }): Promise<void>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
}
