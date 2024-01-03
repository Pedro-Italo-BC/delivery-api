import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';

interface GetDeliveryPersonUseCaseRequest {
  adminId: string;
  deliveryPersonId: string;
}

type GetDeliveryPersonUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    deliveryPerson: DeliveryPerson;
  }
>;

export class GetDeliveryPersonUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
  ) {}

  async execute({
    adminId,
    deliveryPersonId,
  }: GetDeliveryPersonUseCaseRequest): Promise<GetDeliveryPersonUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    return right({
      deliveryPerson,
    });
  }
}
