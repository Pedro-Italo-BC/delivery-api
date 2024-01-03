import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface AddressProps {
  city: string;
  district: string;
  cep: string;
  number: string;
  state: string;
  complement?: string | null;
  street: string;

  longitude: number;
  latitude: number;
}

export class Address extends Entity<AddressProps> {
  get city() {
    return this.props.city;
  }
  get district() {
    return this.props.district;
  }
  get cep() {
    return this.props.cep;
  }
  get number() {
    return this.props.number;
  }
  get state() {
    return this.props.state;
  }
  get complement() {
    return this.props.complement;
  }
  get street() {
    return this.props.street;
  }
  get longitude() {
    return this.props.longitude;
  }
  get latitude() {
    return this.props.latitude;
  }

  static create(props: AddressProps, id?: UniqueEntityID) {
    const address = new Address(props, id);

    return address;
  }
}
