import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { ResourceNotFoundError } from 'src/core/errors/errors/resource-not-found-error';

interface DeleteDeliveryPersonUseCaseRequest {
  adminId: string;
  deliveryPersonId: string;
}

type DeleteDeliveryPersonUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

export class DeleteDeliveryPersonUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
  ) {}

  async execute({
    adminId,
    deliveryPersonId,
  }: DeleteDeliveryPersonUseCaseRequest): Promise<DeleteDeliveryPersonUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    await this.deliveryPersonRepository.delete(deliveryPerson);

    return right(null);
  }
}
