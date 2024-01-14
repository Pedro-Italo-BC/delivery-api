import { EventHandler } from '@/core/events/event-handler';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { ReturnOrderEvent } from '@/domain/delivery/enterprise/events/return-order-event';

export class OnReturnOrder implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendReturnOrderNotification.bind(this),
      ReturnOrderEvent.name,
    );
  }

  private async sendReturnOrderNotification({ order }: ReturnOrderEvent) {
    const orderResponse = await this.orderRepository.findById(
      order.id.toString(),
    );

    if (orderResponse) {
      await this.sendNotification.execute({
        recipientId: orderResponse.receiverPersonId.toString(),
        content: `Seu pedido "${orderResponse.title}" foi devolvido!!`,
        title: `Sua encomenda acabou de ser devolvido!!`,
      });
    }
  }
}
