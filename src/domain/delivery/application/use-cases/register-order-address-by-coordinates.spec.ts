import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { RegisterOrderAddressByCoordinatesUseCase } from './register-order-address-by-coordinates';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeOrder } from 'test/factories/make-order';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';

let adminRepository: InMemoryAdminRepository;
let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;
let sut: RegisterOrderAddressByCoordinatesUseCase;

describe('Create Order-Address By Coordinates', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);

    sut = new RegisterOrderAddressByCoordinatesUseCase(
      adminRepository,
      orderAddressRepository,
      orderRepository,
    );
  });

  it('should be able to register an order-address by coordinates', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const order = makeOrder();
    orderRepository.items.push(order);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
      latitude: -45.6221634,
      longitude: -10.4907302,
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      orderAddress: orderAddressRepository.items[0],
    });
  });

  it('should not be able to register an order-address by coordinates with wrong admin id', async () => {
    const order = makeOrder();
    orderRepository.items.push(order);

    const result = await sut.execute({
      adminId: 'Wrong-Admin-Id',
      orderId: order.id.toString(),
      latitude: -45.6221634,
      longitude: -10.4907302,
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to register an order-address by coordinates with wrong order id', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: 'Wrong-Order-Id',
      latitude: -45.6221634,
      longitude: -10.4907302,
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(OrderDoesNotExistsError);
  });
});
