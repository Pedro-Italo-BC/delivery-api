import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryPersonAddress } from '../../enterprise/entities/delivery-person-address';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';

interface RegisterNewDeliveryPersonAddressByCoordinatesUseCaseRequest {
  adminId: string;
  deliveryPersonId: string;

  longitude: number;
  latitude: number;
}

type RegisterNewDeliveryPersonAddressByCoordinatesUseCaseResponse = Either<
  NotAllowedError | DeliveryPersonDoesNotExistsError,
  {
    deliverypersonAddress: DeliveryPersonAddress;
  }
>;

export class RegisterNewDeliveryPersonAddressByCoordinatesUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
  ) {}

  async execute({
    adminId,
    deliveryPersonId,
    longitude,
    latitude,
  }: RegisterNewDeliveryPersonAddressByCoordinatesUseCaseRequest): Promise<RegisterNewDeliveryPersonAddressByCoordinatesUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new DeliveryPersonDoesNotExistsError(deliveryPersonId));
    }

    const deliverypersonAddress = DeliveryPersonAddress.create({
      latitude,
      longitude,
      deliveryPersonId: deliveryPerson.id,
    });

    deliveryPerson.addressId = deliverypersonAddress.id;

    await this.deliveryPersonRepository.save({
      deliveryPerson,
      deliveryPersonAddress: deliverypersonAddress,
    });

    return right({
      deliverypersonAddress,
    });
  }
}
