import { Either, left, right } from '@/core/either';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';
import { Order } from '../../enterprise/entities/order';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { DeliveryPersonAddressRepository } from '../repositories/delivery-person-address-repository';
import { OrderRepository } from '../repositories/order-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface FetchNearOrdersFromDeliveryPersonUseCaseRequest {
  deliveryPersonId: string;
  page: number;
}

type FetchNearOrdersFromDeliveryPersonUseCaseResponse = Either<
  DeliveryPersonDoesNotExistsError | ResourceNotFoundError,
  {
    orders: Order[];
  }
>;

export class FetchNearOrdersFromDeliveryPersonUseCase {
  constructor(
    private deliveryPersonRepository: DeliveryPersonRepository,
    private deliveryPersonAddressRepository: DeliveryPersonAddressRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    deliveryPersonId,
    page,
  }: FetchNearOrdersFromDeliveryPersonUseCaseRequest): Promise<FetchNearOrdersFromDeliveryPersonUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new DeliveryPersonDoesNotExistsError(deliveryPersonId));
    }

    const deliveryPersonAddress =
      await this.deliveryPersonAddressRepository.findById(
        deliveryPerson.addressId.toString(),
      );

    if (!deliveryPersonAddress) {
      return left(new ResourceNotFoundError());
    }
    const orders =
      await this.orderRepository.findManyNearToDeliveryPersonAddress(
        deliveryPersonAddress,
        { page },
      );

    return right({
      orders,
    });
  }
}
