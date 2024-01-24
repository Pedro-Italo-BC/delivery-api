import { NotificationRepository } from '@/domain/notification/application/reposiotory/notification-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { PrismaNotificationReposiotoryMapper } from '../mappers/prisma-notification-repository-mapper';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    return notification
      ? PrismaNotificationReposiotoryMapper.toDomain(notification)
      : null;
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationReposiotoryMapper.toPrisma(notification);

    await this.prisma.notification.create({
      data,
    });
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationReposiotoryMapper.toPrisma(notification);

    await this.prisma.notification.update({
      where: {
        id: notification.id.toString(),
      },
      data,
    });
  }
}
