import { Either, left, right } from 'src/core/either';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import { HashGenerator } from '../cryptography/hash-generator';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { ResourceNotFoundError } from 'src/core/errors/errors/resource-not-found-error';

interface EditDeliveryPersonUseCaseRequest {
  adminId: string;
  deliveryPersonId: string;

  name: string;
  password: string;
}

type EditDeliveryPersonUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    deliveryPerson: DeliveryPerson;
  }
>;

export class EditDeliveryPersonUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    deliveryPersonId,
    name,
    password,
  }: EditDeliveryPersonUseCaseRequest): Promise<EditDeliveryPersonUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    deliveryPerson.name = name;
    deliveryPerson.password = hashedPassword;

    await this.deliveryPersonRepository.save({ deliveryPerson });

    return right({ deliveryPerson });
  }
}
