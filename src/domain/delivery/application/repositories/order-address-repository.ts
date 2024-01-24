import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '../../enterprise/entities/order';
import { OrderAddress } from '../../enterprise/entities/order-address';

export abstract class OrderAddressRepository {
  abstract create(address: OrderAddress): Promise<void>;
  abstract findById(id: string): Promise<OrderAddress | null>;
  abstract deleteManyByOrderId(orderId: string): Promise<void>;
  abstract findManyOrdersAddressByOrder(
    order: Order,
    params: PaginationParams,
  ): Promise<OrderAddress[]>;
  abstract save(address: OrderAddress): Promise<void>;
}
