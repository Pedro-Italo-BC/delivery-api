import { Either, left, right } from '@/core/either';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { AdminRepository } from '../repositories/admin-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { CPF } from '../../enterprise/entities/value-object/cpf';

interface AuthenticateAdminUseCaseRequest {
  cpf: string;
  password: string;
}
type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

export class AuthenticateAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hasherComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByCPF(CPF.create(cpf));

    if (!admin) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hasherComparer.compare(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
