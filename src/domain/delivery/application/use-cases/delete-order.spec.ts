import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from 'src/core/errors/errors/not-allowed-error';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { DeleteOrderUseCase } from './delete-order';
import { makeOrder } from 'test/factories/make-order';
import { makeOrderAddress } from 'test/factories/make-order-address';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';

let adminRepository: InMemoryAdminRepository;
let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;
let sut: DeleteOrderUseCase;

describe('Delete Delivery-Person', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);
    sut = new DeleteOrderUseCase(adminRepository, orderRepository);
  });

  it('should be able to delete a delivery-person and delivery-person-address', async () => {
    const admin = makeAdmin();

    adminRepository.items.push(admin);

    const order = makeOrder();

    orderRepository.items.push(order);

    const orderAddres = makeOrderAddress({
      orderId: order.id,
    });

    orderAddressRepository.items.push(orderAddres);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(orderRepository.items.length).toEqual(0);
    expect(orderAddressRepository.items.length).toEqual(0);
  });

  it('should not be able to delete a delivery-person with unauthorized admin id', async () => {
    const order = makeOrder();

    orderRepository.items.push(order);

    const result = await sut.execute({
      adminId: 'unauthorized-admin-id',
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toEqual(true);
    expect(orderRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete a delivery-person with wrong delivery-person id', async () => {
    const admin = makeAdmin();

    adminRepository.items.push(admin);

    const order = makeOrder();

    orderRepository.items.push(order);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: 'wrong-delivery-person-id',
    });

    expect(result.isLeft()).toEqual(true);
    expect(orderRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(OrderDoesNotExistsError);
  });
});
