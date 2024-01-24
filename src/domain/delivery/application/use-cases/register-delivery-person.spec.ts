import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { RegisterDeliveryPersonUseCase } from './register-delivery-person';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { CPF } from '../../enterprise/entities/value-object/cpf';
import { DeliveryPersonAlredyExistsError } from './errors/delivery-person-alredy-exists';

let adminRepository: InMemoryAdminRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let hashGenerator: FakeHasher;
let sut: RegisterDeliveryPersonUseCase;

describe('Register Delivery-Person', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    hashGenerator = new FakeHasher();
    sut = new RegisterDeliveryPersonUseCase(
      adminRepository,
      deliveryPersonRepository,
      deliveryPersonAddressRepository,
      hashGenerator,
    );
  });

  it('should be able to register a delivery-person', async () => {
    const admin = makeAdmin();

    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      cpf: '12345678909',
      name: 'John Doe',
      password: '123456',
      addressInfo: {
        latitude: -45.6221634,
        longitude: -10.4907302,
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      deliveryPerson: deliveryPersonRepository.items[0],
    });
    expect(deliveryPersonAddressRepository.items.length).toEqual(1);
  });

  it('should not be able to register a delivery-person with unauthorized admin id', async () => {
    const result = await sut.execute({
      adminId: 'unauthorized-admin-id',
      cpf: '12345678909',
      name: 'John Doe',
      password: '123456',
      addressInfo: {
        latitude: -45.6221634,
        longitude: -10.4907302,
      },
    });

    expect(result.isLeft()).toEqual(true);
    expect(deliveryPersonRepository.items.length).toEqual(0);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(deliveryPersonAddressRepository.items.length).toEqual(0);
  });

  it('should not be able to register a delivery-person if the delivery-person alredy exists', async () => {
    const admin = makeAdmin();
    adminRepository.items.push(admin);

    const deliveryPerson = makeDeliveryPerson({
      cpf: CPF.create('12345678909'),
    });

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      cpf: '12345678909',
      name: 'John Doe',
      password: '123456',
      addressInfo: {
        latitude: -45.6221634,
        longitude: -10.4907302,
      },
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(DeliveryPersonAlredyExistsError);
  });
});
