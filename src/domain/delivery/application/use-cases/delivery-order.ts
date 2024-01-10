import { Either, left, right } from '@/core/either';
import { Order } from '../../enterprise/entities/order';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeliveryPersonRepository } from '../repositories/delivery-person-repository';
import { OrderRepository } from '../repositories/order-repository';
import { InvalidFileTypeError } from './errors/invalid-file-type-error';
import { Uploader } from '../storage/uploader';
import { OrderDoesNotExistsError } from './errors/order-does-not-exists-error';
import { DeliveryPersonDoesNotExistsError } from './errors/delivery-person-does-not-exists-error';

interface DeliveryOrderUseCaseRequest {
  fileUpload: {
    fileName: string;
    fileType: string;
    body: Buffer;
  };

  orderId: string;
  deliveryPersonId: string;
}

type DeliveryOrderUseCaseResponse = Either<
  | OrderDoesNotExistsError
  | DeliveryPersonDoesNotExistsError
  | NotAllowedError
  | InvalidFileTypeError,
  {
    order: Order;
  }
>;

export class DeliveryOrderUseCase {
  constructor(
    private deliveryPersonRepository: DeliveryPersonRepository,
    private orderRepository: OrderRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileUpload,
    deliveryPersonId,
    orderId,
  }: DeliveryOrderUseCaseRequest): Promise<DeliveryOrderUseCaseResponse> {
    if (!/^image\/(png|jpeg|jpg)$/.test(fileUpload.fileType)) {
      return left(new InvalidFileTypeError(fileUpload.fileType));
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new OrderDoesNotExistsError(orderId));
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      return left(new DeliveryPersonDoesNotExistsError(deliveryPersonId));
    }

    if (deliveryPerson.id !== order.deliveryPersonId) {
      return left(new NotAllowedError());
    }

    const { url } = await this.uploader.upload({
      body: fileUpload.body,
      fileName: fileUpload.fileName,
      fileType: fileUpload.fileType,
    });

    order.status = 'DELIVERED';
    order.imgUrl = url;

    await this.orderRepository.save(order);

    return right({
      order,
    });
  }
}
