import { Either, right } from '@/core/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { AdminRepository } from '../repositories/admin-repository';
import { Admin } from '../../enterprise/entities/admin';
import { CPF } from '../../enterprise/entities/value-object/cpf';

interface RegisterAdminUseCaseRequest {
  cpf: string;
  name: string;
  password: string;
}

type RegisterAdminUseCaseResponse = Either<
  null,
  {
    admin: Admin;
  }
>;

export class RegisterAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const hashedPassword = await this.hashGenerator.hash(password);
    const admin = Admin.create({
      cpf: CPF.create(cpf),
      name,
      password: hashedPassword,
    });

    await this.adminRepository.create(admin);

    return right({
      admin,
    });
  }
}
