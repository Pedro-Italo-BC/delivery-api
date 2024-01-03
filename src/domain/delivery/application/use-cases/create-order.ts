import { Either, left, right } from '@/core/either';
import { AdminRepository } from '../repositories/admin-repository';
import { OrderRepository } from '../repositories/order-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderState } from '../../enterprise/entities/value-object/order-state';

interface CreateOrderUseCaseRequest {
  title: string;
  content: string;
  deliveryPersonId: string;
  addressId: string;
  adminId: string;
}

type CreateOrderUseCaseResponse = Either<
  NotAllowedError,
  {
    order: Order;
  }
>;

export class CreateOrderUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    addressId,
    adminId,
    content,
    deliveryPersonId,
    title,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = Order.create({
      addressId: new UniqueEntityID(addressId),
      deliveryPersonId: new UniqueEntityID(deliveryPersonId),
      content,
      status: OrderState.create('WAITING'),
      title,
    });

    await this.orderRepository.create(order);

    return right({
      order,
    });
  }
}
