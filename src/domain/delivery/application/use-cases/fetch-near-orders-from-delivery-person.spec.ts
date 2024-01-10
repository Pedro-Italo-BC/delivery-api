import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { FetchNearOrdersFromDeliveryPersonUseCase } from './fetch-near-orders-from-delivery-person';
import { makeDeliveryPersonAddress } from 'test/factories/make-delivery-person-address';
import { makeOrderAddress } from 'test/factories/make-order-address';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';
import { makeOrder } from 'test/factories/make-order';

let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;
let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;
let deliveryPersonRepository: InMemoryDeliveryPersonRepository;
let sut: FetchNearOrdersFromDeliveryPersonUseCase;

describe('Fetch Near Orders From Delivery-Person', () => {
  beforeEach(() => {
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);
    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );
    sut = new FetchNearOrdersFromDeliveryPersonUseCase(
      deliveryPersonRepository,
      deliveryPersonAddressRepository,
      orderRepository,
    );
  });

  it('should be able to fetch near order from delivery-peron', async () => {
    const deliveryPerson = makeDeliveryPerson();

    const deliveryPersonAddress = makeDeliveryPersonAddress({
      latitude: -15.79564772,
      longitude: -49.15324962,
      deliveryPersonId: deliveryPerson.id,
    });

    deliveryPerson.addressId = deliveryPersonAddress.id;

    deliveryPersonRepository.items.push(deliveryPerson);
    deliveryPersonAddressRepository.items.push(deliveryPersonAddress);

    for (let i = 1; i <= 22; i++) {
      const nearOrderAddress = makeOrderAddress({
        latitude: -15.81197464,
        longitude: -49.15552381,
      });

      const order = makeOrder({ addressId: nearOrderAddress.id });

      orderRepository.items.push(order);

      orderAddressRepository.items.push(nearOrderAddress);
    }

    for (let i = 1; i <= 2; i++) {
      const farOrderAddress = makeOrderAddress({
        latitude: -20.73200126,
        longitude: -49.70205721,
      });

      const order = makeOrder({ addressId: farOrderAddress.id });

      orderRepository.items.push(order);

      orderAddressRepository.items.push(farOrderAddress);
    }

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      page: 2,
    });

    if (result.isLeft()) {
      expect(result.isRight()).toBe(true);
      return;
    }

    expect(result.isRight()).toBe(true);
    expect(result.value.orders).toHaveLength(2);
    expect(orderAddressRepository.items.length).toEqual(24);
  });

  it('should not be able to fetch near order from delivery-peron with wrong delivery-person-id', async () => {
    for (let i = 1; i <= 22; i++) {
      const nearOrderAddress = makeOrderAddress({
        latitude: -15.81197464,
        longitude: -49.15552381,
      });

      orderAddressRepository.items.push(nearOrderAddress);
    }

    for (let i = 1; i <= 2; i++) {
      const farOrderAddress = makeOrderAddress({
        latitude: -20.73200126,
        longitude: -49.70205721,
      });

      orderAddressRepository.items.push(farOrderAddress);
    }

    const result = await sut.execute({
      deliveryPersonId: 'wrong-delivery-person-id',
      page: 2,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DeliveryPersonDoesNotExistsError);
  });
});
