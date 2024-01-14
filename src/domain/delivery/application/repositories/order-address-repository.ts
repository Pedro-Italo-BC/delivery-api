import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '../../enterprise/entities/order';
import { OrderAddress } from '../../enterprise/entities/order-address';

export abstract class OrderAddressRepository {
  abstract create(address: OrderAddress): Promise<void>;
  abstract findById(id: string): Promise<OrderAddress | null>;
  abstract deleteManyByOrderId(orderId: string): Promise<void>;
  abstract findManyOrdersByOrder(
    order: Order,
    params: PaginationParams,
  ): Promise<OrderAddress[]>;
}
