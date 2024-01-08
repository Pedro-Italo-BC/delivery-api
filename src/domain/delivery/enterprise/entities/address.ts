import { Entity } from 'src/core/entities/entity';

export interface AddressProps {
  city: string;
  district: string;
  cep: string;
  number: string;
  state: string;
  complement?: string | null;
  street: string;

  createdAt: Date;
  longitude: number;
  latitude: number;
}

export abstract class Address<
  Props extends AddressProps,
> extends Entity<Props> {
  get city() {
    return this.props.city;
  }
  set city(value: string) {
    this.props.city = value;
  }
  get district() {
    return this.props.district;
  }
  set district(value: string) {
    this.props.district = value;
  }
  get cep() {
    return this.props.cep;
  }
  set cep(value: string) {
    this.props.cep = value;
  }
  get number() {
    return this.props.number;
  }
  set number(value: string) {
    this.props.number = value;
  }
  get state() {
    return this.props.state;
  }
  set state(value: string) {
    this.props.state = value;
  }
  get complement(): string | null {
    return this.props.complement ?? null;
  }
  set complement(value: string | null | undefined) {
    if (value === undefined) {
      return;
    }

    this.props.complement = value;
  }
  get street() {
    return this.props.street;
  }
  set street(value: string) {
    this.props.street = value;
  }
  get longitude() {
    return this.props.longitude;
  }
  set longitude(value: number) {
    this.props.longitude = value;
  }
  get latitude() {
    return this.props.latitude;
  }
  set latitude(value: number) {
    this.props.latitude = value;
  }
}
