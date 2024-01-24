import { Optional } from '@/core/types/optional';
import { Address, AddressProps } from './address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface OrderAddressProps extends AddressProps {
  orderId: UniqueEntityID;
}
export class OrderAddress extends Address<OrderAddressProps> {
  get orderId() {
    return this.props.orderId;
  }

  set orderId(value: UniqueEntityID) {
    this.props.orderId = value;
  }

  static create(
    props: Optional<OrderAddressProps, 'createdAt' | 'orderId'>,
    id?: UniqueEntityID,
  ) {
    const orderAddress = new OrderAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        orderId: props.orderId ?? new UniqueEntityID(),
      },
      id,
    );

    return orderAddress;
  }
}
