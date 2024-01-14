import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Order } from '../entities/order';

export class ChangeOrderAddressEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public orderAddressId: UniqueEntityID;

  constructor(order: Order, orderAddressId: UniqueEntityID) {
    this.ocurredAt = new Date();
    this.order = order;
    this.orderAddressId = orderAddressId;
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}
