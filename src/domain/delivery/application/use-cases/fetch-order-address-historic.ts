import { Either, left, right } from '@/core/either';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';
import { OrderAddress } from '../../enterprise/entities/order-address';
import { OrderRepository } from '../repositories/order-repository';
import { OrderAddressRepository } from '../repositories/order-address-repository';
import { AdminRepository } from '../repositories/admin-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface FetchOrderAddressHistoricUseCaseRequest {
  orderId: string;
  adminId: string;
  page: number;
}

type FetchOrderAddressHistoricUseCaseResponse = Either<
  OrderDoesNotExistsError | NotAllowedError,
  {
    orderAddressList: OrderAddress[];
  }
>;

export class FetchOrderAddressHistoricUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderAddressRepository: OrderAddressRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    adminId,
    orderId,
    page,
  }: FetchOrderAddressHistoricUseCaseRequest): Promise<FetchOrderAddressHistoricUseCaseResponse> {
    const admin = await this.adminRepository.findById(adminId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new OrderDoesNotExistsError(orderId));
    }

    const orderAddressList =
      await this.orderAddressRepository.findManyOrdersAddressByOrder(order, {
        page,
      });

    return right({
      orderAddressList,
    });
  }
}
