import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { FakeGeolocationSearch } from 'test/geolocation/fake-geolocation-search';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { RegisterOrderAddressByInfoUseCase } from './register-order-address-by-info';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeOrder } from 'test/factories/make-order';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';

let adminRepository: InMemoryAdminRepository;
let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;
let fakeGeolocationSearch: FakeGeolocationSearch;
let sut: RegisterOrderAddressByInfoUseCase;

describe('Create Order-Address By Info', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    orderAddressRepository = new InMemoryOrderAddressRepository();
    fakeGeolocationSearch = new FakeGeolocationSearch();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);
    sut = new RegisterOrderAddressByInfoUseCase(
      adminRepository,
      orderAddressRepository,
      orderRepository,
      fakeGeolocationSearch,
    );
  });

  it('should be able to register an order-address by Info', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const order = makeOrder();

    orderRepository.items.push(order);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
      cep: '111111-000',
      city: 'fake-city',
      district: 'fake-district',
      number: '28',
      state: 'fake-state',
      street: 'fake-street',
      complement: 'fake-complement',
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      orderAddress: orderAddressRepository.items[0],
    });
  });

  it('should not be able to register an order-address by Info with wrong admin id', async () => {
    const order = makeOrder();

    orderRepository.items.push(order);

    const result = await sut.execute({
      adminId: 'Wrong-Admin-Id',
      orderId: order.id.toString(),
      cep: '111111-000',
      city: 'fake-city',
      district: 'fake-district',
      number: '28',
      state: 'fake-state',
      street: 'fake-street',
      complement: 'fake-complement',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to register an order-address by Info with wrong order id', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: 'Wrong-Order-Id',
      cep: '111111-000',
      city: 'fake-city',
      district: 'fake-district',
      number: '28',
      state: 'fake-state',
      street: 'fake-street',
      complement: 'fake-complement',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(OrderDoesNotExistsError);
  });
});
