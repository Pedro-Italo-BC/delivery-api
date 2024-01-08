import {
  AddressByCoordinates,
  AddressByCoordinatesProps,
  AddressByCoordinatesResponse,
} from '@/domain/delivery/application/geolocation/address-by-coordinates';
import {
  AddressByInfo,
  AddressByInfoProps,
  AddressByInfoResponse,
} from '@/domain/delivery/application/geolocation/address-by-info';
import { faker } from '@faker-js/faker';

export class FakeGeolocationSearch
  implements AddressByInfo, AddressByCoordinates
{
  async getByInfo(props: AddressByInfoProps): Promise<AddressByInfoResponse> {
    return {
      ...props,
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    };
  }
  async getByCoordinates(
    props: AddressByCoordinatesProps,
  ): Promise<AddressByCoordinatesResponse> {
    return {
      ...props,
      cep: faker.location.zipCode(),
      city: faker.location.zipCode(),
      district: faker.location.city(),
      number: faker.location.buildingNumber(),
      state: faker.location.state(),
      complement: faker.location.state(),
      street: faker.location.street(),
    };
  }
}
