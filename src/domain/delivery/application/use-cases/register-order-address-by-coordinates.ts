import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { OrderAddressRepository } from '../repositories/order-address-repository';
import { OrderAddress } from '../../enterprise/entities/order-address';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderRepository } from '../repositories/order-repository';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';

interface RegisterOrderAddressByCoordinatesUseCaseRequest {
  adminId: string;
  orderId: string;

  longitude: number;
  latitude: number;
}

type RegisterOrderAddressByCoordinatesUseCaseResponse = Either<
  NotAllowedError | OrderDoesNotExistsError,
  {
    orderAddress: OrderAddress;
  }
>;

export class RegisterOrderAddressByCoordinatesUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private orderAddressRepository: OrderAddressRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    adminId,
    orderId,
    longitude,
    latitude,
  }: RegisterOrderAddressByCoordinatesUseCaseRequest): Promise<RegisterOrderAddressByCoordinatesUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new OrderDoesNotExistsError(orderId));
    }

    const orderAddress = OrderAddress.create({
      latitude,
      longitude,
      orderId: new UniqueEntityID(orderId),
    });

    await this.orderAddressRepository.create(orderAddress);

    return right({
      orderAddress,
    });
  }
}
