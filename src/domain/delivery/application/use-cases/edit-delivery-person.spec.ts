import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { EditDeliveryPersonUseCase } from './edit-delivery-person';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeAdmin } from 'test/factories/make-admin';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';

let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let adminRepository: InMemoryAdminRepository;
let hashGenerator: FakeHasher;
let sut: EditDeliveryPersonUseCase;

describe('Edit Delivery-Person', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository();
    hashGenerator = new FakeHasher();

    sut = new EditDeliveryPersonUseCase(
      adminRepository,
      deliveryPersonRepository,
      hashGenerator,
    );
  });

  it('should be able to edit Delivery-Person', async () => {
    const admin = makeAdmin();
    const deliveryPerson = makeDeliveryPerson();

    adminRepository.items.push(admin);
    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      name: 'New Name',
      password: '123456',
    });

    const hashedPassword = await hashGenerator.hash('123456');

    expect(deliveryPersonRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'New Name',
        password: hashedPassword,
      }),
    );

    expect(result.isRight()).toEqual(true);
  });

  it('should not be able to edit Delivery-Person with not allowed admin id', async () => {
    const deliveryPerson = makeDeliveryPerson();

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: 'not-allowed-id',
      deliveryPersonId: deliveryPerson.id.toString(),
      name: 'New Name',
      password: '123456',
    });

    expect(deliveryPersonRepository.items[0]).toEqual(deliveryPerson);

    expect(result.isLeft()).toEqual(true);
  });
});
