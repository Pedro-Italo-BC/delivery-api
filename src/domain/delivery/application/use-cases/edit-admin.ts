import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { HashComparer } from '../cryptography/hash-comparer';
import { AdminRepository } from '../repositories/admin-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { Admin } from '../../enterprise/entities/admin';

interface EditAdminUseCaseRequest {
  adminId: string;
  password: string;

  newName: string;
  newPassword: string;
}

type EditAdminUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { admin: Admin }
>;

export class EditAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hash: HashComparer & HashGenerator,
  ) {}

  async execute({
    adminId,
    password,
    newName,
    newPassword,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new ResourceNotFoundError());
    }

    const isPasswordMatch = await this.hash.compare(password, admin.password);

    if (!isPasswordMatch) {
      return left(new NotAllowedError());
    }

    const newPasswordHashed = await this.hash.hash(newPassword);

    admin.name = newName;
    admin.password = newPasswordHashed;

    this.adminRepository.save(admin);

    return right({ admin });
  }
}
