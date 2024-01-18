import { Either, left, right } from '@/core/either';
import { AdminRepository } from '../repositories/admin-repository';
import { OrderRepository } from '../repositories/order-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Order } from '../../enterprise/entities/order';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderState } from '../../enterprise/entities/value-object/order-state';
import { AddressByInfo } from '../geolocation/address-by-info';
import { OrderAddress } from '../../enterprise/entities/order-address';

interface CreateOrderUseCaseRequest {
  title: string;
  content: string;
  adminId: string;

  currentAddress: {
    city: string;
    district: string;
    cep: string;
    number: string;
    state: string;
    complement?: string | null;
    street: string;
  };

  deliveryAddress: {
    city: string;
    district: string;
    cep: string;
    number: string;
    state: string;
    complement?: string | null;
    street: string;
  };
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
    private addressByInfo: AddressByInfo,
  ) {}

  async execute({
    adminId,
    content,
    currentAddress,
    title,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = Order.create({
      content,
      status: OrderState.create('WAITING'),
      receiverPersonId: new UniqueEntityID(adminId),
      title,
    });

    const currentOrderAddress =
      await this.addressByInfo.getByInfo(currentAddress);

    const deliveryOrderAddress =
      await this.addressByInfo.getByInfo(currentAddress);

    const currentOrderAddressResponse = OrderAddress.create({
      ...currentOrderAddress,
      orderId: order.id,
    });

    const deliveryOrderAddressResponse = OrderAddress.create({
      ...deliveryOrderAddress,
      orderId: order.id,
    });

    order.deliveryAddressId = deliveryOrderAddressResponse.id;
    order.currentAddressId = currentOrderAddressResponse.id;

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
