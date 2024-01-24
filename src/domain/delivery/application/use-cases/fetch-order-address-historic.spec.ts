import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { FetchOrderAddressHistoricUseCase } from './fetch-order-address-historic';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeOrder } from 'test/factories/make-order';
import { makeAdmin } from 'test/factories/make-admin';
import { makeOrderAddress } from 'test/factories/make-order-address';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;
let adminRepository: InMemoryAdminRepository;
let sut: FetchOrderAddressHistoricUseCase;

describe('Fetch Order Address Historic', () => {
  beforeEach(() => {
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);

    adminRepository = new InMemoryAdminRepository();
    sut = new FetchOrderAddressHistoricUseCase(
      orderRepository,
      orderAddressRepository,
      adminRepository,
    );
  });

  it('should be able to fetch order address historic', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const order = makeOrder();
    orderRepository.items.push(order);

    for (let i = 1; i <= 22; i++) {
      const orderAddress = makeOrderAddress({ orderId: order.id });

      orderAddressRepository.items.push(orderAddress);

      order.currentAddressId = orderAddress.id;
      orderRepository.save(order);
    }

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
      page: 2,
    });

    if (result.isLeft()) {
      expect(result.isRight()).toBe(true);
      return;
    }

    expect(result.isRight()).toBe(true);
    expect(result.value.orderAddressList).toHaveLength(2);
  });

  it('should not be able to fetch order address historic with wrong order id', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: 'wrong-order-id',
      page: 2,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderDoesNotExistsError);
  });

  it('should not be able to fetch order address historic with wrong admin id', async () => {
    const order = makeOrder();
    orderRepository.items.push(order);

    const result = await sut.execute({
      adminId: 'wrong-admin-id',
      orderId: order.id.toString(),
      page: 2,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
