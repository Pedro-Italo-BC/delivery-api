import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { CreateOrderUseCase } from './create-order';
import { makeAdmin } from 'test/factories/make-admin';
import { makeAddress } from 'test/factories/make-address';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let adminRepository: InMemoryAdminRepository;
let orderRepository: InMemoryOrderRepository;
let sut: CreateOrderUseCase;

describe('Create Order', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    orderRepository = new InMemoryOrderRepository();
    sut = new CreateOrderUseCase(adminRepository, orderRepository);
  });

  it('should be able to create an order', async () => {
    const admin = makeAdmin();
    await adminRepository.items.push(admin);
    const address = makeAddress();
    const deliveryPerson = makeDeliveryPerson();

    const result = await sut.execute({
      addressId: address.id.toString(),
      adminId: admin.id.toString(),
      deliveryPersonId: deliveryPerson.id.toString(),
      content: 'order-content',
      title: 'order-tilte',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: orderRepository.items[0],
    });
  });

  it('should not be able to create an order with wrong admin id', async () => {
    const address = makeAddress();
    const deliveryPerson = makeDeliveryPerson();

    const result = await sut.execute({
      addressId: address.id.toString(),
      adminId: 'wrong-admin-id',
      deliveryPersonId: deliveryPerson.id.toString(),
      content: 'order-content',
      title: 'order-tilte',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
