import { EventHandler } from '@/core/events/event-handler';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { DomainEvents } from '@/core/events/domain-events';
import { ChangeOrderAddressEvent } from '@/domain/delivery/enterprise/events/change-order-address-event';
export class OnChangeOrderAddress implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendChangeOrderAddressNotification.bind(this),
      ChangeOrderAddressEvent.name,
    );
  }

  private async sendChangeOrderAddressNotification({
    order,
  }: ChangeOrderAddressEvent) {
    const orderResponse = await this.orderRepository.findById(
      order.id.toString(),
    );

    if (orderResponse) {
      await this.sendNotification.execute({
        recipientId: orderResponse.receiverPersonId.toString(),
        content: `Seu pedido de "${orderResponse.title}" está em outro endereço neste momento"!!`,
        title: `Sua encomenda esta em outro lugar!!`,
      });
    }
  }
}
