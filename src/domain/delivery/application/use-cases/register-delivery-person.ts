import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { CPF } from '../../enterprise/entities/value-object/cpf';

interface RegisterDeliveryPersonUseCaseRequest {
  adminId: string;

  cpf: string;
  name: string;
  password: string;
}

type RegisterDeliveryPersonUseCaseResponse = Either<
  NotAllowedError,
  {
    deliveryPerson: DeliveryPerson;
  }
>;

export class RegisterDeliveryPersonUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    adminId,
    cpf,
    name,
    password,
  }: RegisterDeliveryPersonUseCaseRequest): Promise<RegisterDeliveryPersonUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryPerson = DeliveryPerson.create({
      cpf: CPF.create(cpf),
      name,
      password: hashedPassword,
    });

    await this.deliveryPersonRepository.create(deliveryPerson);

    return right({
      deliveryPerson,
    });
  }
}
