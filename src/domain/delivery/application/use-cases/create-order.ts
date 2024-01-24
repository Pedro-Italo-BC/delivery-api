import { Either, left, right } from '@/core/either';
import { AdminRepository } from '../repositories/admin-repository';
import { OrderRepository } from '../repositories/order-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderState } from '../../enterprise/entities/value-object/order-state';
import { OrderAddress } from '../../enterprise/entities/order-address';
import { Injectable } from '@nestjs/common';
import { OrderAddressRepository } from '../repositories/order-address-repository';

interface CreateOrderUseCaseRequest {
  title: string;
  content: string;
  adminId: string;

  currentAddress: {
    latitude: number;
    longitude: number;
  };

  deliveryAddress: {
    latitude: number;
    longitude: number;
  };
}

type CreateOrderUseCaseResponse = Either<
  NotAllowedError,
  {
    order: Order;
  }
>;

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private orderRepository: OrderRepository,
    private orderAddressReposiotory: OrderAddressRepository,
  ) {}

  async execute({
    adminId,
    content,
    currentAddress,
    deliveryAddress,
    title,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const currentOrderAddressResponse = OrderAddress.create({
      latitude: currentAddress.latitude,
      longitude: currentAddress.longitude,
    });

    const deliveryOrderAddressResponse = OrderAddress.create({
      latitude: deliveryAddress.latitude,
      longitude: deliveryAddress.longitude,
    });

    await Promise.all([
      this.orderAddressReposiotory.create(currentOrderAddressResponse),
      this.orderAddressReposiotory.create(deliveryOrderAddressResponse),
    ]);

    const order = Order.create({
      content,
      status: OrderState.create('WAITING'),
      receiverPersonId: new UniqueEntityID(adminId),
      title,
      deliveryAddressId: deliveryOrderAddressResponse.id,
      currentAddressId: currentOrderAddressResponse.id,
    });

    currentOrderAddressResponse.orderId = order.id;
    deliveryOrderAddressResponse.orderId = order.id;

    await this.orderRepository.create({
      order,
      currentAddress: currentOrderAddressResponse,
      deliveryAddress: deliveryOrderAddressResponse,
    });

    return right({
      order,
    });
  }
}
