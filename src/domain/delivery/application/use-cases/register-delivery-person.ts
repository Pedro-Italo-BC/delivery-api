import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { CPF } from '../../enterprise/entities/value-object/cpf';
import { DeliveryPersonAddress } from '../../enterprise/entities/delivery-person-address';
import { AddressByInfo } from '../geolocation/address-by-info';

interface RegisterDeliveryPersonUseCaseRequest {
  adminId: string;

  cpf: string;
  name: string;
  password: string;

  addressInfo: {
    city: string;
    district: string;
    cep: string;
    number: string;
    state: string;
    complement?: string | null;
    street: string;
  };
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
    private addressByInfo: AddressByInfo,
  ) {}

  async execute({
    adminId,
    cpf,
    name,
    addressInfo,
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

    const addresInfoWithCordinates =
      await this.addressByInfo.getByInfo(addressInfo);

    const deliveryPersonAddress = DeliveryPersonAddress.create({
      ...addresInfoWithCordinates,
      deliveryPersonId: deliveryPerson.id,
    });

    deliveryPerson.addressId = deliveryPersonAddress.id;

    await this.deliveryPersonRepository.create({
      deliveryPerson,
      deliveryPersonAddress,
    });

    return right({
      deliveryPerson,
    });
  }
}
