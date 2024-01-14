import { MockInstance, vi } from 'vitest';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { OnPickedUpOrder } from './on-picked-up-order';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryDeliveryPersonRepository } from 'test/repositories/in-memory-delivery-person-repository';
import { InMemoryOrderAddressRepository } from 'test/repositories/in-memory-order-address-repository';
import { InMemoryDeliveryPersonAddressRepository } from 'test/repositories/in-memory-delivery-person-address-repository';
import { makeOrderAddress } from 'test/factories/make-order-address';
import { makeOrder } from 'test/factories/make-order';
import { makeDeliveryPersonAddress } from 'test/factories/make-delivery-person-address';
import { makeDeliveryPerson } from 'test/factories/make-delivery-person';
import { waitFor } from 'test/utils/wait-for';

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
describe('On Picked-up Order', () => {
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

    new OnPickedUpOrder(orderRepository, sendNotificationUseCase);
  });

  it('should be able to send a notification when an order be piked-up', async () => {
    const orderAddress = makeOrderAddress();
    orderAddressRepository.items.push(orderAddress);
    const order = makeOrder({ addressId: orderAddress.id });
    orderRepository.items.push(order);

    const deliveryPersonAddress = makeDeliveryPersonAddress();
    deliveryPersonAddressRepository.items.push(deliveryPersonAddress);
    const deliveryPerson = makeDeliveryPerson({
      addressId: deliveryPersonAddress.id,
    });
    deliveryPersonRepository.items.push(deliveryPerson);

    order.status = 'PICKED_UP';

    orderRepository.save(order);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
