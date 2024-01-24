import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { OrderRepository } from '../repositories/order-repository';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { Order } from '../../enterprise/entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface PickUpOrderUseCaseRequest {
  orderId: string;
  deliveryPersonId: string;
}

type PickUpOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>;

@Injectable()
export class PickUpOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryPersonRepository: DeliveryPersonRepository,
  ) {}

  async execute({
    deliveryPersonId,
    orderId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse> {
    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
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
