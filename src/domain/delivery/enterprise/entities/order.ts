import { Optional } from '@/core/types/optional';
import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { OrderState, OrderStateProps } from './value-object/order-state';

export interface OrderProps {
  title: string;
  content: string;
  deliveryPersonId: UniqueEntityID;
  addressId: UniqueEntityID;
  status: OrderState;

  createAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
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
    this.props.status = OrderState.create(value);
    this.touch();
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId;
  }

  set deliveryPersonId(value: UniqueEntityID) {
    this.props.deliveryPersonId = value;
    this.touch();
  }

  get addressId() {
    return this.props.addressId;
  }

  set addressId(value: UniqueEntityID) {
    this.props.addressId = value;
    this.touch();
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

  static create(props: Optional<OrderProps, 'createAt'>, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        createAt: props.createAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
