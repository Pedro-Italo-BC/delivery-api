import { OrderAddress } from '../../enterprise/entities/order-address';

export abstract class OrderAddressRepository {
  abstract create(address: OrderAddress): Promise<void>;
  abstract findById(id: string): Promise<OrderAddress | null>;
  abstract deleteManyByOrderId(orderId: string): Promise<void>;
}
