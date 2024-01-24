import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { RegisterNewDeliveryPersonAddressByCoordinatesUseCase } from './register-new-delivery-person-address-by-coordinates';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { makeDeliveryPersonAddress } from 'test/factories/make-delivery-person-address';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';

let adminRepository: InMemoryAdminRepository;
let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;

let sut: RegisterNewDeliveryPersonAddressByCoordinatesUseCase;

describe('Register New Delivery-Person-Address By Coordinates', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    sut = new RegisterNewDeliveryPersonAddressByCoordinatesUseCase(
      adminRepository,
      deliveryPersonRepository,
    );
  });

  it('it should be able to register new Delivery-Person-Addres by Coordinates', async () => {
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
      latitude: -45.6221634,
      longitude: -10.4907302,
    });

    expect(result.isRight()).toBe(true);
    expect(deliveryPersonAddressRepository.items.length).toEqual(2);
    expect(deliveryPersonAddressRepository.items[1].id).toEqual(
      deliveryPerson.addressId,
    );
  });
  it('it should not be able to register new Delivery-Person-Addres by Coordinates with wrong admin id', async () => {
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
      latitude: -45.6221634,
      longitude: -10.4907302,
    });

    expect(result.isLeft()).toBe(true);
    expect(deliveryPersonAddressRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('it should be able to register new Delivery-Person-Addres by Coordinates with wrong Delivery-Person id', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryPersonId: 'wrong-delivery-person-id',
      latitude: -45.6221634,
      longitude: -10.4907302,
    });

    expect(result.isLeft()).toBe(true);
    expect(deliveryPersonAddressRepository.items.length).toEqual(0);
    expect(result.value).toBeInstanceOf(DeliveryPersonDoesNotExistsError);
  });
});
