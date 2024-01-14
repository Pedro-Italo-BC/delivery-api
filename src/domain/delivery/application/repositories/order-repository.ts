import { PaginationParams } from '@/core/repositories/pagination-params';
import { DeliveryPersonAddress } from '../../enterprise/entities/delivery-person-address';
import { Order } from '../../enterprise/entities/order';
import { OrderAddress } from '../../enterprise/entities/order-address';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';

export abstract class OrderRepository {
  abstract create(order: {
    order: Order;
    orderAddress: OrderAddress;
  }): Promise<void>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findManyNearToDeliveryPersonAddress(
    deliveryPersonAddress: DeliveryPersonAddress,
    params: PaginationParams,
  ): Promise<Order[]>;
  abstract findManyDeliveredOrdersByDeliveryPerson(
    deliveryPerson: DeliveryPerson,
    params: PaginationParams,
  ): Promise<Order[]>;
}
