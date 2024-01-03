import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { EditOrderUseCase } from './edit-order';
import { makeAdmin } from 'test/factories/make-admin';
import { makeOrder } from 'test/factories/make-order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let adminRepository: InMemoryAdminRepository;
let orderRepository: InMemoryOrderRepository;
let sut: EditOrderUseCase;

describe('Edit Order', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    orderRepository = new InMemoryOrderRepository();
    sut = new EditOrderUseCase(adminRepository, orderRepository);
  });

  it('should be able to edit an order', async () => {
    const admin = makeAdmin();
    await adminRepository.items.push(admin);

    const order = makeOrder();
    await orderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id.toString(),
      adminId: admin.id.toString(),
      addressId: 'edited-address-id',
      deliveryPersonId: 'edited-delivery-person-id',
      content: 'edited-content',
      title: 'edited-title',
      status: 'PICKED_UP',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: orderRepository.items[0],
    });
  });

  it('should not be able to edit an order with wrong admin id', async () => {
    const order = makeOrder();
    await orderRepository.items.push(order);

    const result = await sut.execute({
      orderId: order.id.toString(),
      adminId: 'wrong-admin-id',
      addressId: 'edited-address-id',
      deliveryPersonId: 'edited-delivery-person-id',
      content: 'edited-content',
      title: 'edited-title',
      status: 'PICKED_UP',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit an order if resource does not exist', async () => {
    const admin = makeAdmin();
    await adminRepository.items.push(admin);

    const result = await sut.execute({
      orderId: 'wrong-order-id',
      adminId: admin.id.toString(),
      addressId: 'edited-address-id',
      deliveryPersonId: 'edited-delivery-person-id',
      content: 'edited-content',
      title: 'edited-title',
      status: 'PICKED_UP',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
