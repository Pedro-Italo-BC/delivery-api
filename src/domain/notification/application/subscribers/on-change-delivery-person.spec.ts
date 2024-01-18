import { MockInstance, vi } from 'vitest';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { makeOrderAddress } from 'test/factories/make-order-address';
import { makeOrder } from 'test/factories/make-order';
import { makeDeliveryPersonAddress } from 'test/factories/make-delivery-person-address';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { waitFor } from 'test/utils/wait-for';
import { OnChangeDeliveryPerson } from './on-change-delivery-person';

let orderAddressRepository: InMemoryOrderAddressRepository;
let orderRepository: InMemoryOrderRepository;

let deliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository;

let deliveryPersonRepository: InMemoryDeliveryPersonRepository;

let notificationRepository: InMemoryNotificationRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;
describe('On Change Delivery-Person', () => {
  beforeEach(() => {
    orderAddressRepository = new InMemoryOrderAddressRepository();
    orderRepository = new InMemoryOrderRepository(orderAddressRepository);

    deliveryPersonAddressRepository =
      new InMemoryDeliveryPersonAddressRepository();
    deliveryPersonRepository = new InMemoryDeliveryPersonRepository(
      deliveryPersonAddressRepository,
    );

    notificationRepository = new InMemoryNotificationRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnChangeDeliveryPerson(
      orderRepository,
      deliveryPersonRepository,
      sendNotificationUseCase,
    );
  });

  it('should be able to send a notification when change the delivery-person', async () => {
    const deliveryPersonAddress = makeDeliveryPersonAddress();
    deliveryPersonAddressRepository.items.push(deliveryPersonAddress);
    const deliveryPerson = makeDeliveryPerson({
      addressId: deliveryPersonAddress.id,
    });
    deliveryPersonRepository.items.push(deliveryPerson);

    const currentOrderAddress = makeOrderAddress();
    orderAddressRepository.items.push(currentOrderAddress);

    const deliveryOrderAddress = makeOrderAddress();
    orderAddressRepository.items.push(deliveryOrderAddress);

    const order = makeOrder({
      currentAddressId: currentOrderAddress.id,
      deliveryAddressId: deliveryOrderAddress.id,
      deliveryPersonId: deliveryPerson.id,
    });
    orderRepository.create({
      order,
      currentAddress: currentOrderAddress,
      deliveryAddress: deliveryOrderAddress,
    });

    const newDelieryPerson = makeDeliveryPerson();

    deliveryPersonRepository.items.push(newDelieryPerson);
    order.deliveryPersonId = newDelieryPerson.id;

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
