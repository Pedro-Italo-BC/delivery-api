import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let notificationRepository: InMemoryNotificationRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotificationUseCase(notificationRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification();

    notificationRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(notificationRepository.items[0].readAt).toEqual(expect.any(Date));
  });

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    });

    notificationRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'recipient-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});