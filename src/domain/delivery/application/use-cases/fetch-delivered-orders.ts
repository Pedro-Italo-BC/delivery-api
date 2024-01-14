import { Either, left, right } from '@/core/either';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';
import { Order } from '../../enterprise/entities/order';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { OrderRepository } from '../repositories/order-repository';

interface FetchDeliveredOrdersUseCaseRequest {
  deliveryPersonId: string;
  page: number;
}

type FetchDeliveredOrdersUseCaseResponse = Either<
  DeliveryPersonDoesNotExistsError,
  {
    orders: Order[];
  }
>;

export class FetchDeliveredOrdersUseCase {
  constructor(
    private deliveryPersonRepository: DeliveryPersonRepository,
    private orderReposiotory: OrderRepository,
  ) {}

  async execute({
    deliveryPersonId,
    page,
  }: FetchDeliveredOrdersUseCaseRequest): Promise<FetchDeliveredOrdersUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new DeliveryPersonDoesNotExistsError(deliveryPersonId));
    }

    const orders =
      await this.orderReposiotory.findManyDeliveredOrdersByDeliveryPerson(
        deliveryPerson,
        { page },
      );

    return right({
      orders,
    });
  }
}
