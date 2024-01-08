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

  static create(
    props: Optional<OrderAddressProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const orderAddress = new OrderAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return orderAddress;
  }
}
