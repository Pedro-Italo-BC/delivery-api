import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Address, AddressProps } from './address';
import { Optional } from '@/core/types/optional';

export interface DeliveryPersonAddressProps extends AddressProps {
  deliveryPersonId: UniqueEntityID;
}

export class DeliveryPersonAddress extends Address<DeliveryPersonAddressProps> {
  get deliveryPersonId() {
    return this.props.deliveryPersonId;
  }

  set deliveryPersonId(value: UniqueEntityID) {
    this.props.deliveryPersonId = value;
  }

  static create(
    props: Optional<
      DeliveryPersonAddressProps,
      'createdAt' | 'deliveryPersonId'
    >,
    id?: UniqueEntityID,
  ) {
    const deliveryPersonAddress = new DeliveryPersonAddress(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        deliveryPersonId: props.deliveryPersonId ?? new UniqueEntityID(),
      },
      id,
    );
    return deliveryPersonAddress;
  }
}
