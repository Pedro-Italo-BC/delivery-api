import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Order } from '../../enterprise/entities/order';
import { AdminRepository } from '../repositories/admin-repository';
import { OrderRepository } from '../repositories/order-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderStateProps } from '../../enterprise/entities/value-object/order-state';

interface EditOrderUseCaseRequest {
  adminId: string;
  orderId: string;

  title: string;
  content: string;
  status: OrderStateProps;
  deliveryPersonId: string;
  addressId: string;
}

type EditOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order;
  }
>;

export class EditOrderUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    adminId,
    orderId,
    addressId,
    content,
    deliveryPersonId,
    status,
    title,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    order.currentAddressId = new UniqueEntityID(addressId);
    order.deliveryPersonId = new UniqueEntityID(deliveryPersonId);
    order.content = content;
    order.status = status;
    order.title = title;

    await this.orderRepository.save(order);

    return right({ order });
  }
}
