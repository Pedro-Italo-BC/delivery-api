import { EventHandler } from '@/core/events/event-handler';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { PickedUpOrderEvent } from '@/domain/delivery/enterprise/events/picked-up-order-event';

export class OnPickedUpOrder implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendPickedUpNotification.bind(this),
      PickedUpOrderEvent.name,
    );
  }

  private async sendPickedUpNotification({ order }: PickedUpOrderEvent) {
    const orderResponse = await this.orderRepository.findById(
      order.id.toString(),
    );

    if (orderResponse) {
      await this.sendNotification.execute({
        recipientId: orderResponse.receiverPersonId.toString(),
        content: `Seu pedido "${orderResponse.title}" acabou de ser retirado!!`,
        title: `Sua encomenda foi retirada e está a caminho!!`,
      });
    }
  }
}
