import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { OrderRepository } from '../repositories/order-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { Order } from '../../enterprise/entities/order';

interface PickUpOrderUseCaseRequest {
  orderId: string;
  deliveryPersonId: string;
}

type PickUpOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  { order: Order }
>;

export class PickUpOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
  ) {}

  async execute({
    deliveryPersonId,
    orderId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new ResourceNotFoundError());
    }

    order.deliveryPersonId = deliveryPerson.id;
    order.status = 'PICKED_UP';

    this.orderRepository.save(order);

    return right({
      order,
    });
  }
}
