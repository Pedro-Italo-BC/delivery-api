import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { RegisterDeliveryPersonUseCase } from './register-delivery-person';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';

let adminRepository: InMemoryAdminRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let hashGenerator: FakeHasher;
let sut: RegisterDeliveryPersonUseCase;

describe('Register Delivery-Person', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository();
    hashGenerator = new FakeHasher();
    sut = new RegisterDeliveryPersonUseCase(
      adminRepository,
      deliveryPersonRepository,
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
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      deliveryPerson: deliveryPersonRepository.items[0],
    });
  });

  it('should not be able to register a delivery-person with unauthorized admin id', async () => {
    const result = await sut.execute({
      adminId: 'unauthorized-admin-id',
      cpf: '12345678909',
      name: 'John Doe',
      password: '123456',
    });

    expect(result.isLeft()).toEqual(true);
    expect(deliveryPersonRepository.items.length).toEqual(0);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
