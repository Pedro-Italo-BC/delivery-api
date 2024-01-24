import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';

let adminRepository: InMemoryAdminRepository;
let orderRepository: InMemoryOrderRepository;
let orderAddressRepository: InMemoryOrderAddressRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);
    sut = new CreateOrderUseCase(
      adminRepository,
      orderRepository,
      orderAddressRepository,
    );
  });

  it('should be able to create an order', async () => {
    const admin = makeAdmin();
    await adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      content: 'order-content',
      title: 'order-tilte',
      currentAddress: {
        latitude: -45.6221634,
        longitude: -10.4907302,
      },
      deliveryAddress: {
        latitude: -45.6221634,
        longitude: -10.4907302,
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: orderRepository.items[0],
    });
    expect(orderAddressRepository.items.length).toEqual(2);
  });

  it('should not be able to create an order with wrong admin id', async () => {
    const result = await sut.execute({
      adminId: 'wrong-admin-id',
      content: 'order-content',
      title: 'order-tilte',
      currentAddress: {
        latitude: -45.6221634,
        longitude: -10.4907302,
      },
      deliveryAddress: {
        latitude: -45.6221634,
        longitude: -10.4907302,
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(orderAddressRepository.items.length).toEqual(0);
  });
});
