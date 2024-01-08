import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { RegisterNewDeliveryPersonAddressByInfoUseCase } from './register-new-delivery-person-address-by-info';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { FakeGeolocationSearch } from 'test/geolocation/fake-geolocation-search';
import { makeAdmin } from 'test/factories/make-admin';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { makeDeliveryPersonAddress } from 'test/factories/make-delivery-person-address';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';

let adminRepository: InMemoryAdminRepository;
let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let fakeGeolocationSearch: FakeGeolocationSearch;

let sut: RegisterNewDeliveryPersonAddressByInfoUseCase;

describe('Register New Delivery-Person-Address By Info', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    fakeGeolocationSearch = new FakeGeolocationSearch();
    sut = new RegisterNewDeliveryPersonAddressByInfoUseCase(
      adminRepository,
      deliveryPersonRepository,
      fakeGeolocationSearch,
    );
  });

  it('it should be able to register new Delivery-Person-Addres by Info', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const deliveryPerson = makeDeliveryPerson();

    const deliveryPersonAddress = makeDeliveryPersonAddress({
      deliveryPersonId: deliveryPerson.id,
    });
    deliveryPersonAddressRepository.items.push(deliveryPersonAddress);

    deliveryPerson.addressId = deliveryPersonAddress.id;

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      cep: '12345-678',
      city: 'FakeCity',
      district: 'FakeDistrict',
      number: '123',
      state: 'FakeState',
      complement: 'FakeComplement',
      street: 'FakeStreet',
    });

    expect(result.isRight()).toBe(true);
    expect(deliveryPersonAddressRepository.items.length).toEqual(2);
    expect(deliveryPersonAddressRepository.items[1].id).toEqual(
      deliveryPerson.addressId,
    );
  });
  it('it should not be able to register new Delivery-Person-Addres by Info with wrong admin id', async () => {
    const deliveryPerson = makeDeliveryPerson();
    const deliveryPersonAddress = makeDeliveryPersonAddress({
      deliveryPersonId: deliveryPerson.id,
    });
    deliveryPersonAddressRepository.items.push(deliveryPersonAddress);

    deliveryPerson.addressId = deliveryPersonAddress.id;

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: 'Wrong-admin-id',
      deliveryPersonId: deliveryPerson.id.toString(),
      cep: '12345-678',
      city: 'FakeCity',
      district: 'FakeDistrict',
      number: '123',
      state: 'FakeState',
      complement: 'FakeComplement',
      street: 'FakeStreet',
    });

    expect(result.isLeft()).toBe(true);
    expect(deliveryPersonAddressRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('it should be able to register new Delivery-Person-Addres by Info with wrong Delivery-Person id', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryPersonId: 'wrong-delivery-person-id',
      cep: '12345-678',
      city: 'FakeCity',
      district: 'FakeDistrict',
      number: '123',
      state: 'FakeState',
      complement: 'FakeComplement',
      street: 'FakeStreet',
    });

    expect(result.isLeft()).toBe(true);
    expect(deliveryPersonAddressRepository.items.length).toEqual(0);
    expect(result.value).toBeInstanceOf(DeliveryPersonDoesNotExistsError);
  });
});
