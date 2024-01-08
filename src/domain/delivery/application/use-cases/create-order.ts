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
  deliveryPersonId: string;
  addressId: string;
  adminId: string;

  addressInfo: {
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
    addressId,
    adminId,
    content,
    deliveryPersonId,
    title,
    addressInfo,
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

    const address = await this.addressByInfo.getByInfo(addressInfo);

    const orderAddress = OrderAddress.create({
      ...address,
      orderId: order.id,
    });

    await this.orderRepository.create({ order, orderAddress });

    return right({
      order,
    });
  }
}
