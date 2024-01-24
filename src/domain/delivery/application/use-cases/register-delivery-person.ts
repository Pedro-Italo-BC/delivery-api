import { Either, left, right } from 'src/core/either';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';
import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { CPF } from '../../enterprise/entities/value-object/cpf';
import { DeliveryPersonAddress } from '../../enterprise/entities/delivery-person-address';
import { DeliveryPersonAlredyExistsError } from './errors/delivery-person-alredy-exists';
import { Injectable } from '@nestjs/common';
import { DeliveryPersonAddressRepository } from '../repositories/delivery-person-address-repository';

interface RegisterDeliveryPersonUseCaseRequest {
  adminId: string;

  cpf: string;
  name: string;
  password: string;

  addressInfo: {
    longitude: number;
    latitude: number;
  };
}

type RegisterDeliveryPersonUseCaseResponse = Either<
  NotAllowedError | DeliveryPersonAlredyExistsError,
  {
    deliveryPerson: DeliveryPerson;
  }
>;

@Injectable()
export class RegisterDeliveryPersonUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
    private deliveryPersonAddressRepository: DeliveryPersonAddressRepository,
    private hashGenerator: HashGenerator,
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

    const delieryPersonAlredyExists =
      await this.deliveryPersonRepository.findByCPF(CPF.create(cpf));

    if (delieryPersonAlredyExists) {
      return left(new DeliveryPersonAlredyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryPerson = DeliveryPerson.create({
      cpf: CPF.create(cpf),
      name,
      password: hashedPassword,
    });

    const deliveryPersonAddress = DeliveryPersonAddress.create({
      latitude: addressInfo.latitude,
      longitude: addressInfo.longitude,
    });

    await this.deliveryPersonAddressRepository.create(deliveryPersonAddress);

    deliveryPerson.addressId = deliveryPersonAddress.id;
    deliveryPersonAddress.deliveryPersonId = deliveryPerson.id;

    await this.deliveryPersonRepository.create({
      deliveryPerson,
      deliveryPersonAddress,
    });

    return right({
      deliveryPerson,
    });
  }
}
