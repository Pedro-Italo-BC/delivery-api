import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { FakeGeolocationSearch } from 'test/geolocation/fake-geolocation-search';

let adminRepository: InMemoryAdminRepository;
let orderRepository: InMemoryOrderRepository;
let inMemoryOrderAddressRepository: InMemoryOrderAddressRepository;
let fakeGeolocationSearch: FakeGeolocationSearch;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    inMemoryOrderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(
      inMemoryOrderAddressRepository,
    );
    fakeGeolocationSearch = new FakeGeolocationSearch();
    sut = new CreateOrderUseCase(
      adminRepository,
      orderRepository,
      fakeGeolocationSearch,
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
        cep: '12345-678',
        city: 'FakeCity',
        district: 'FakeDistrict',
        number: '123',
        state: 'FakeState',
        complement: 'FakeComplement',
        street: 'FakeStreet',
      },
      deliveryAddress: {
        cep: '12345-678',
        city: 'FakeCity',
        district: 'FakeDistrict',
        number: '123',
        state: 'FakeState',
        complement: 'FakeComplement',
        street: 'FakeStreet',
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: orderRepository.items[0],
    });
    expect(inMemoryOrderAddressRepository.items.length).toEqual(2);
  });

  it('should not be able to create an order with wrong admin id', async () => {
    const result = await sut.execute({
      adminId: 'wrong-admin-id',
      content: 'order-content',
      title: 'order-tilte',
      currentAddress: {
        cep: '12345-678',
        city: 'FakeCity',
        district: 'FakeDistrict',
        number: '123',
        state: 'FakeState',
        complement: 'FakeComplement',
        street: 'FakeStreet',
      },
      deliveryAddress: {
        cep: '12345-678',
        city: 'FakeCity',
        district: 'FakeDistrict',
        number: '123',
        state: 'FakeState',
        complement: 'FakeComplement',
        street: 'FakeStreet',
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryOrderAddressRepository.items.length).toEqual(0);
  });
});
