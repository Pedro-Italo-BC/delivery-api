import { EventHandler } from '@/core/events/event-handler';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { ChangeDeliveryPersonEvent } from '@/domain/delivery/enterprise/events/change-delivery-person-event';
import { DeliveryPersonRepository } from '@/domain/delivery/application/repositories/delivery-person-repository';

export class OnChangeDeliveryPerson implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryPersonReposiotory: DeliveryPersonRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendChangeDeliveryPersonNotification.bind(this),
      ChangeDeliveryPersonEvent.name,
    );
  }

  private async sendChangeDeliveryPersonNotification({
    order,
    deliveryPersonId,
  }: ChangeDeliveryPersonEvent) {
    const orderResponse = await this.orderRepository.findById(
      order.id.toString(),
    );

    const deliveryPerson = await this.deliveryPersonReposiotory.findById(
      deliveryPersonId.toString(),
    );

    if (orderResponse && deliveryPerson) {
      await this.sendNotification.execute({
        recipientId: orderResponse.receiverPersonId.toString(),
        content: `O entregador "${deliveryPerson.name}", neste momento está responsavel pelo seu pedido de "${order.title}"`,
        title: `Outro entregador está com sua encomenda!!`,
      });
    }
  }
}
