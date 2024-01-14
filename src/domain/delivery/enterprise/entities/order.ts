import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { OrderState, OrderStateProps } from './value-object/order-state';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { PickedUpOrderEvent } from '../events/picked-up-order-event';
import { CreateOrderEvent } from '../events/create-order-event';
import { DeliveredOrderEvent } from '../events/delivered-order-event';
import { ReturnOrderEvent } from '../events/return-order-event';
import { ChangeDeliveryPersonEvent } from '../events/change-delivery-person-event';
import { ChangeOrderAddressEvent } from '../events/change-order-address-event';

export interface OrderProps {
  title: string;
  content: string;
  deliveryPersonId?: UniqueEntityID | null;
  addressId: UniqueEntityID;
  receiverPersonId: UniqueEntityID;
  status: OrderState;
  imgUrl?: string | null;
  createAt: Date;
  updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  get title() {
    return this.props.title;
  }

  set title(value: string) {
    this.props.title = value;
    this.touch();
  }

  get content() {
    return this.props.content;
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  get status() {
    return this.props.status.value;
  }

  set status(value: OrderStateProps) {
    if (value !== this.props.status.value) {
      this.props.status = OrderState.create(value);
      this.touch();
      this.statusChangeEvent(value);
    }
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId;
  }

  set deliveryPersonId(value: UniqueEntityID | undefined | null) {
    this.props.deliveryPersonId = value;
    this.touch();

    if (value) {
      this.addDomainEvent(new ChangeDeliveryPersonEvent(this, value));
    }
  }

  get addressId() {
    return this.props.addressId;
  }

  set addressId(value: UniqueEntityID) {
    this.props.addressId = value;
    this.touch();

    this.addDomainEvent(
      new ChangeOrderAddressEvent(this, this.props.addressId),
    );
  }

  get imgUrl() {
    return this.props.imgUrl;
  }

  set imgUrl(value: string | null | undefined) {
    this.props.imgUrl = value;
    this.touch();
  }

  get receiverPersonId() {
    return this.props.receiverPersonId;
  }

  set receiverPersonId(value: UniqueEntityID) {
    this.props.receiverPersonId = value;
  }

  get createAt() {
    return this.props.createAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  private statusChangeEvent(status: OrderStateProps) {
    switch (status) {
      case 'PICKED_UP':
        this.addDomainEvent(new PickedUpOrderEvent(this));
        break;
      case 'DELIVERED':
        this.addDomainEvent(new DeliveredOrderEvent(this));
        break;
      case 'RETURNED':
        this.addDomainEvent(new ReturnOrderEvent(this));
        break;
    }
  }

  static create(
    props: Optional<OrderProps, 'createAt' | 'addressId'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        createAt: props.createAt ?? new Date(),
        addressId: props.addressId ?? new UniqueEntityID(),
      },
      id,
    );

    const isNewOrder = !id;

    if (isNewOrder) {
      order.addDomainEvent(new CreateOrderEvent(order));
    }

    return order;
  }
}
