import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';
import { DeleteDeliveryPersonUseCase } from './delete-delivery-person';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { ResourceNotFoundError } from 'src/core/errors/errors/resource-not-found-error';

let adminRepository: InMemoryAdminRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let sut: DeleteDeliveryPersonUseCase;

describe('Delete Delivery-Person', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository();
    sut = new DeleteDeliveryPersonUseCase(
      adminRepository,
      deliveryPersonRepository,
    );
  });

  it('should be able to delete a delivery-person', async () => {
    const admin = makeAdmin();

    adminRepository.items.push(admin);

    const deliveryPerson = makeDeliveryPerson();

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(deliveryPersonRepository.items.length).toEqual(0);
  });

  it('should not be able to delete a delivery-person with unauthorized admin id', async () => {
    const deliveryPerson = makeDeliveryPerson();

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: 'unauthorized-admin-id',
      deliveryPersonId: deliveryPerson.id.toString(),
    });

    expect(result.isLeft()).toEqual(true);
    expect(deliveryPersonRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete a delivery-person with wrong delivery-person id', async () => {
    const admin = makeAdmin();

    adminRepository.items.push(admin);

    const deliveryPerson = makeDeliveryPerson();

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      deliveryPersonId: 'wrong-delivery-person-id',
    });

    expect(result.isLeft()).toEqual(true);
    expect(deliveryPersonRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
