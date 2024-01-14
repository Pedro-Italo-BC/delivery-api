import { EventHandler } from '@/core/events/event-handler';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { CreateOrderEvent } from '@/domain/delivery/enterprise/events/create-order-event';

export class OnCreateOrder implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendCreateOrderNotification.bind(this),
      CreateOrderEvent.name,
    );
  }

  private async sendCreateOrderNotification({ order }: CreateOrderEvent) {
    const orderResponse = await this.orderRepository.findById(
      order.id.toString(),
    );

    if (orderResponse) {
      await this.sendNotification.execute({
        recipientId: orderResponse.receiverPersonId.toString(),
        content: `Seu pedido "${orderResponse.title}" está aguardando retirada neste momento!!`,
        title: `Sua encomenda está aguardando retirada!!`,
      });
    }
  }
}
