import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { HashComparer } from '../cryptography/hash-comparer';
import { AdminRepository } from '../repositories/admin-repository';

interface DeleteAdminUseCaseRequest {
  adminId: string;
  password: string;
}

type DeleteAdminUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  null
>;

export class DeleteAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    adminId,
    password,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new ResourceNotFoundError());
    }

    const isPasswordMatch = await this.hashComparer.compare(
      password,
      admin.password,
    );

    if (!isPasswordMatch) {
      return left(new NotAllowedError());
    }

    this.adminRepository.delete(admin);

    return right(null);
  }
}
