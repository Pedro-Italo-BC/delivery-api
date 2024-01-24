import { Entity } from 'src/core/entities/entity';

export interface AddressProps {
  longitude: number;
  latitude: number;
  createdAt: Date;
}

export abstract class Address<
  Props extends AddressProps,
> extends Entity<Props> {
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
  get createdAt() {
    return this.props.createdAt;
  }
}
