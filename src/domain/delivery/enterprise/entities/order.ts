import { Optional } from '@/core/types/optional';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { OrderState, OrderStateProps } from './value-object/order-state';
import { AggregateRoot } from '@/core/entities/aggregate-root';

export interface OrderProps {
  title: string;
  content: string;
  deliveryPersonId?: UniqueEntityID | null;
  addressId: UniqueEntityID;
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
    this.props.status = OrderState.create(value);
    this.touch();
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
  }

  get addressId() {
    return this.props.addressId;
  }

  set addressId(value: UniqueEntityID) {
    this.props.addressId = value;
    this.touch();
  }

  get imgUrl() {
    return this.props.imgUrl;
  }

  set imgUrl(value: string | null | undefined) {
    this.props.imgUrl = value;
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

    return order;
  }
}
