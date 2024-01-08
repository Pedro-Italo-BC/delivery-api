import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';
import { AdminRepository } from '../repositories/admin-repository';
import { OrderRepository } from '../repositories/order-repository';

interface DeleteOrderUseCaseRequest {
  adminId: string;
  orderId: string;
}

type DeleteOrderUseCaseResponse = Either<
  NotAllowedError | OrderDoesNotExistsError,
  null
>;

export class DeleteOrderUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    adminId,
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new OrderDoesNotExistsError(orderId));
    }

    await this.orderRepository.delete(order);

    return right(null);
  }
}
