import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { AddressByInfo } from '../geolocation/address-by-info';
import { OrderAddress } from '../../enterprise/entities/order-address';
import { OrderAddressRepository } from '../repositories/order-address-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { OrderRepository } from '../repositories/order-repository';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';

interface RegisterOrderAddressByInfoUseCaseRequest {
  adminId: string;
  orderId: string;

  city: string;
  district: string;
  cep: string;
  number: string;
  state: string;
  complement?: string | null;
  street: string;
}

type RegisterOrderAddressByInfoUseCaseResponse = Either<
  NotAllowedError,
  {
    orderAddress: OrderAddress;
  }
>;

export class RegisterOrderAddressByInfoUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private orderAddressRepository: OrderAddressRepository,
    private orderRepository: OrderRepository,
    private addressByInfo: AddressByInfo,
  ) {}

  async execute({
    adminId,
    cep,
    city,
    district,
    number,
    state,
    street,
    complement,
    orderId,
  }: RegisterOrderAddressByInfoUseCaseRequest): Promise<RegisterOrderAddressByInfoUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new OrderDoesNotExistsError(orderId));
    }

    const addressInfo = await this.addressByInfo.getByInfo({
      cep,
      city,
      district,
      number,
      state,
      street,
      complement,
    });

    const orderAddress = OrderAddress.create({
      orderId: new UniqueEntityID(orderId),
      ...addressInfo,
    });

    await this.orderAddressRepository.create(orderAddress);

    return right({ orderAddress });
  }
}
