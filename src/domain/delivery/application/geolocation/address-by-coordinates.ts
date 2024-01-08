export interface AddressByCoordinatesProps {
  latitude: number;
  longitude: number;
}

export interface AddressByCoordinatesResponse {
  city: string;
  district: string;
  cep: string;
  number: string;
  state: string;
  complement: string | null;
  street: string;

  latitude: number;
  longitude: number;
}

export abstract class AddressByCoordinates {
  abstract getByCoordinates(
    props: AddressByCoordinatesProps,
  ): Promise<AddressByCoordinatesResponse>;
}
