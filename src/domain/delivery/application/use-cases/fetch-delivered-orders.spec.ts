import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';
import { makeOrder } from 'test/factories/make-order';
import { FetchDeliveredOrdersUseCase } from './fetch-delivered-orders';
import { OrderState } from '../../enterprise/entities/value-object/order-state';

let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;
let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let sut: FetchDeliveredOrdersUseCase;

describe('Fetch delivered orders', () => {
  beforeEach(() => {
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    sut = new FetchDeliveredOrdersUseCase(
      deliveryPersonRepository,
      orderRepository,
    );
  });

  it('should be able to fetch delivered orders', async () => {
    const deliveryPerson = makeDeliveryPerson();
    deliveryPersonRepository.items.push(deliveryPerson);

    const order = makeOrder({
      status: OrderState.create('DELIVERED'),
      deliveryPersonId: deliveryPerson.id,
    });

    orderRepository.items.push(order);

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      orders: expect.arrayContaining([order]),
    });
  });

  it('should not be able to fetch delivered orders with wrong delivery-person id', async () => {
    const order = makeOrder({
      status: OrderState.create('DELIVERED'),
    });

    orderRepository.items.push(order);

    const result = await sut.execute({
      deliveryPersonId: 'wrong-delivery-person-id',
      page: 1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DeliveryPersonDoesNotExistsError);
  });
});
