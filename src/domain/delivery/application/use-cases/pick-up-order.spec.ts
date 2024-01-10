import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { PickUpOrderUseCase } from './pick-up-order';
import { makeOrder } from 'test/factories/make-order';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;
let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let sut: PickUpOrderUseCase;

describe('Pick Up Order', () => {
  beforeEach(() => {
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    sut = new PickUpOrderUseCase(orderRepository, deliveryPersonRepository);
  });

  it('should be able to pick up an order', async () => {
    const order = makeOrder({ deliveryPersonId: undefined });
    orderRepository.items.push(order);

    const deliveryPerson = makeDeliveryPerson();
    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: orderRepository.items[0],
    });
  });

  it('should be not able to pick up an order with wrong delivery-preson id', async () => {
    const order = makeOrder({ deliveryPersonId: undefined });
    orderRepository.items.push(order);

    const result = await sut.execute({
      deliveryPersonId: 'wrong-delivery-person-id',
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be not able to pick up an order with wrong order id', async () => {
    const deliveryPerson = makeDeliveryPerson();
    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      orderId: 'wrong-order-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
