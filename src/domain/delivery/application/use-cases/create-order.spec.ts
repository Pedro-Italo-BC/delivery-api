import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { makeAdmin } from 'test/factories/make-admin';
import { makeOrderAddress } from 'test/factories/make-order-address';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
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
    const orderAddress = makeOrderAddress();
    const deliveryPerson = makeDeliveryPerson();

    const result = await sut.execute({
      addressId: orderAddress.id.toString(),
      adminId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      content: 'order-content',
      title: 'order-tilte',
      addressInfo: {
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
    expect(inMemoryOrderAddressRepository.items.length).toEqual(1);
  });

  it('should not be able to create an order with wrong admin id', async () => {
    const orderAddress = makeOrderAddress();
    const deliveryPerson = makeDeliveryPerson();

    const result = await sut.execute({
      addressId: orderAddress.id.toString(),
      adminId: 'wrong-admin-id',
      deliveryPersonId: deliveryPerson.id.toString(),
      content: 'order-content',
      title: 'order-tilte',
      addressInfo: {
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
