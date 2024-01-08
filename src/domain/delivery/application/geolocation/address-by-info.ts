export interface AddressByInfoProps {
  city: string;
  district: string;
  cep: string;
  number: string;
  state: string;
  complement?: string | null;
  street: string;
}

export interface AddressByInfoResponse {
  latitude: number;
  longitude: number;

  city: string;
  district: string;
  cep: string;
  number: string;
  state: string;
  complement?: string | null;
  street: string;
}

export abstract class AddressByInfo {
  abstract getByInfo(props: AddressByInfoProps): Promise<AddressByInfoResponse>;
}
