import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { Prisma, Notification as PrismaNotification } from '@prisma/client';

export class PrismaNotificationReposiotoryMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      content: notification.content,
      createdAt: notification.createdAt,
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      id: notification.id.toString(),
      readAt: notification.readAt,
    };
  }
}
