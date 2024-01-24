import { NotificationRepository } from '@/domain/notification/application/reposiotory/notification-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = [];

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(notification.id),
    );

    if (itemIndex === -1) {
      return;
    }

    this.items[itemIndex] = notification;
  }
}
