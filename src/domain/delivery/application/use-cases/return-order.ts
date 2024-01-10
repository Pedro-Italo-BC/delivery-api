import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';
import { OrderRepository } from '../repositories/order-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';

interface ReturnOrderUseCaseRequest {
  orderId: string;
  deliveryPersonId: string;
}

type ReturnOrderUseCaseResponse = Either<
  NotAllowedError | OrderDoesNotExistsError | DeliveryPersonDoesNotExistsError,
  {
    order: Order;
  }
>;

export class ReturnOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
  ) {}

  async execute({
    deliveryPersonId,
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new OrderDoesNotExistsError(orderId));
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new DeliveryPersonDoesNotExistsError(deliveryPersonId));
    }

    if (!order.deliveryPersonId?.equals(deliveryPerson.id)) {
      return left(new NotAllowedError());
    }

    order.status = 'RETURNED';

    await this.orderRepository.save(order);

    return right({
      order,
    });
  }
}
