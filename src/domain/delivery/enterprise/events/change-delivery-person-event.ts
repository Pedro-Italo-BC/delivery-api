import { DomainEvent } from '@/core/events/domain-event';
import { Order } from '../entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class ChangeDeliveryPersonEvent implements DomainEvent {
  public ocurredAt: Date;
  public order: Order;
  public deliveryPersonId: UniqueEntityID;

  constructor(order: Order, deliveryPersonId: UniqueEntityID) {
    this.order = order;
    this.deliveryPersonId = deliveryPersonId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id;
  }
}
