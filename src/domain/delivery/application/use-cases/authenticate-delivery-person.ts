import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { CPF } from '../../enterprise/entities/value-object/cpf';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { Injectable } from '@nestjs/common';

interface AuthenticateDeliveryPersonUseCaseRequest {
  cpf: string;
  password: string;
}
type AuthenticateDeliveryPersonUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateDeliveryPersonUseCase {
  constructor(
    private deliveryPersonRepository: DeliveryPersonRepository,
    private hasherComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliveryPersonUseCaseRequest): Promise<AuthenticateDeliveryPersonUseCaseResponse> {
    const deliveryPerson = await this.deliveryPersonRepository.findByCPF(
      CPF.create(cpf),
    );

    if (!deliveryPerson) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hasherComparer.compare(
      password,
      deliveryPerson.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryPerson.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
