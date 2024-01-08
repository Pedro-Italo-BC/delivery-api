import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';
import { CPF } from './value-object/cpf';
import { AggregateRoot } from '@/core/entities/aggregate-root';

export interface DeliveryPersonProps {
  cpf: CPF;
  name: string;
  password: string;
  addressId: UniqueEntityID;
  updatedAt?: Date | null;
  createdAt: Date;
}

export class DeliveryPerson extends AggregateRoot<DeliveryPersonProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;

    this.touch();
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;

    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get addressId() {
    return this.props.addressId;
  }

  set addressId(value: UniqueEntityID) {
    this.props.addressId = value;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<DeliveryPersonProps, 'createdAt' | 'addressId'>,
    id?: UniqueEntityID,
  ) {
    const deliveryPerson = new DeliveryPerson(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        addressId: props.addressId ?? new UniqueEntityID(),
      },
      id,
    );

    return deliveryPerson;
  }
}
