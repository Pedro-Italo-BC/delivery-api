import { EventHandler } from '@/core/events/event-handler';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { DeliveredOrderEvent } from '@/domain/delivery/enterprise/events/delivered-order-event';

export class OnDeliveredOrder implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendPickedUpNotification.bind(this),
      DeliveredOrderEvent.name,
    );
  }

  private async sendPickedUpNotification({ order }: DeliveredOrderEvent) {
    const orderResponse = await this.orderRepository.findById(
      order.id.toString(),
    );

    if (orderResponse) {
      await this.sendNotification.execute({
        recipientId: orderResponse.receiverPersonId.toString(),
        content: `Seu pedido "${orderResponse.title}" acabou de ser entregue!!`,
        title: `Sua encomenda foi entregue com sucesso!!`,
      });
    }
  }
}
