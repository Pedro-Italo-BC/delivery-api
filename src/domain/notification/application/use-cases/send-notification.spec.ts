import { SendNotificationUseCase } from './send-notification';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';

let notificationRepository: InMemoryNotificationRepository;
let sut: SendNotificationUseCase;

describe('Send Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotificationUseCase(notificationRepository);
  });

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteúdo da notificação',
    });

    expect(result.isRight()).toBe(true);
    expect(notificationRepository.items[0]).toEqual(result.value?.notification);
  });
});
