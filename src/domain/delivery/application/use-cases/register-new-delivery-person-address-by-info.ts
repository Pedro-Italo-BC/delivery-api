import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { AddressByInfo } from '../geolocation/address-by-info';
import { DeliveryPersonAddress } from '../../enterprise/entities/delivery-person-address';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';

interface RegisterNewDeliveryPersonAddressByInfoUseCaseRequest {
  adminId: string;
  deliveryPersonId: string;

  city: string;
  district: string;
  cep: string;
  number: string;
  state: string;
  complement?: string | null;
  street: string;
}

type RegisterNewDeliveryPersonAddressByInfoUseCaseResponse = Either<
  NotAllowedError,
  {
    deliveryPersonAddress: DeliveryPersonAddress;
  }
>;

export class RegisterNewDeliveryPersonAddressByInfoUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
    private addressByInfo: AddressByInfo,
  ) {}

  async execute({
    adminId,
    cep,
    city,
    district,
    number,
    state,
    street,
    complement,
    deliveryPersonId,
  }: RegisterNewDeliveryPersonAddressByInfoUseCaseRequest): Promise<RegisterNewDeliveryPersonAddressByInfoUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new DeliveryPersonDoesNotExistsError(deliveryPersonId));
    }

    const addressInfo = await this.addressByInfo.getByInfo({
      cep,
      city,
      district,
      number,
      state,
      street,
      complement,
    });

    const deliveryPersonAddress = DeliveryPersonAddress.create({
      deliveryPersonId: deliveryPerson.id,
      ...addressInfo,
    });

    deliveryPerson.addressId = deliveryPersonAddress.id;

    await this.deliveryPersonRepository.save({
      deliveryPerson,
      deliveryPersonAddress,
    });

    return right({ deliveryPersonAddress });
  }
}
