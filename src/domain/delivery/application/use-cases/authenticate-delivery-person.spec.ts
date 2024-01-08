import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { AuthenticateDeliveryPersonUseCase } from './authenticate-delivery-person';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';

let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let hasher: FakeHasher;
let encrypter: FakeEncrypter;
let sut: AuthenticateDeliveryPersonUseCase;

describe('Authenticate Delivery-Person', () => {
  beforeEach(() => {
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    hasher = new FakeHasher();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateDeliveryPersonUseCase(
      deliveryPersonRepository,
      hasher,
      encrypter,
    );
  });

  it('should be able to authenticate an admin', async () => {
    const passwordHashed = await hasher.hash('123456');

    const deliveryPerson = makeDeliveryPerson({
      password: passwordHashed,
    });

    await deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      cpf: deliveryPerson.cpf.value,
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate an admin with wrong cpf', async () => {
    const passwordHashed = await hasher.hash('123456');

    const deliveryPerson = makeDeliveryPerson({
      password: passwordHashed,
    });

    await deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      cpf: 'wrong-cpf',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(WrongCredentialsError);
  });

  it('should not be able to authenticate an admin with wrong password', async () => {
    const passwordHashed = await hasher.hash('123456');

    const deliveryPerson = makeDeliveryPerson({
      password: passwordHashed,
    });

    await deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      cpf: deliveryPerson.cpf.value,
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(WrongCredentialsError);
  });
});
