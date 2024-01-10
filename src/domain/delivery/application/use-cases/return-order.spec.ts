import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeOrder } from 'test/factories/make-order';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { OrderState } from '../../enterprise/entities/value-object/order-state';
import { ReturnOrderUseCase } from './return-order';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;

let sut: ReturnOrderUseCase;

describe('Return Order', () => {
  beforeEach(() => {
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    sut = new ReturnOrderUseCase(orderRepository, deliveryPersonRepository);
  });

  it('should be able to return a order', async () => {
    const deliveryPerson = makeDeliveryPerson();

    deliveryPersonRepository.items.push(deliveryPerson);

    const order = makeOrder({
      deliveryPersonId: deliveryPerson.id,
      status: OrderState.create('PICKED_UP'),
    });

    orderRepository.items.push(order);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      order: orderRepository.items[0],
    });
  });

  it('should not be able to return a order with wrong deliveryPerson id', async () => {
    const order = makeOrder({
      status: OrderState.create('PICKED_UP'),
    });

    orderRepository.items.push(order);

    const result = await sut.execute({
      deliveryPersonId: 'wrong-delivery-person-id',
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DeliveryPersonDoesNotExistsError);
  });

  it('should not be able to return a order with wrong order id', async () => {
    const deliveryPerson = makeDeliveryPerson();

    deliveryPersonRepository.items.push(deliveryPerson);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      orderId: 'wrong-order-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(OrderDoesNotExistsError);
  });

  it('should not be able to return a order with not allowed delivery-person id', async () => {
    const deliveryPerson1 = makeDeliveryPerson();
    const deliveryPerson2 = makeDeliveryPerson();

    deliveryPersonRepository.items.push(deliveryPerson1);
    deliveryPersonRepository.items.push(deliveryPerson2);

    const order = makeOrder({
      deliveryPersonId: deliveryPerson1.id,
      status: OrderState.create('PICKED_UP'),
    });

    orderRepository.items.push(order);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson2.id.toString(),
      orderId: order.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
