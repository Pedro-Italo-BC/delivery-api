import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { GetDeliveryPersonUseCase } from './get-delivery-person';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';

let adminRepository: InMemoryAdminRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let sut: GetDeliveryPersonUseCase;

describe('Get Delivery-Person', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository();
    sut = new GetDeliveryPersonUseCase(
      adminRepository,
      deliveryPersonRepository,
    );
  });

  it('should be able to get a delivery-person', async () => {
    const admin = makeAdmin();

    await adminRepository.items.push(admin);

    const deliveryPerson = makeDeliveryPerson();

    await deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ deliveryPerson });
  });

  it('should not be able to get a delivery-person with not allowed admin id', async () => {
    const deliveryPerson = makeDeliveryPerson();

    await deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: 'not-allowed-id',
      deliveryPersonId: deliveryPerson.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
  });
});
