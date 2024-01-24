import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Order } from '@/domain/delivery/enterprise/entities/order';
import { OrderState } from '@/domain/delivery/enterprise/entities/value-object/order-state';
import { Prisma, Order as PrismaOrder } from '@prisma/client';

export class PrismaOrderRepositoryMapper {
  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      content: order.content,
      currentAddressId: order.currentAddressId.toString(),
      deliveryAddressId: order.deliveryAddressId.toString(),
      title: order.title,
      createdAt: order.createAt,
      id: order.id.toString(),
      imgUrl: order.imgUrl,
      status: order.status,
      updatedAt: order.updatedAt,
      receiverPersonId: order.receiverPersonId.toString(),
      deliveryPersonId: order.deliveryPersonId?.toString(),
    };
  }

  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        content: raw.content,
        receiverPersonId: new UniqueEntityID(raw.receiverPersonId),
        status: OrderState.create(raw.status),
        title: raw.title,
        createAt: raw.createdAt,
        currentAddressId: new UniqueEntityID(raw.currentAddressId),
        deliveryAddressId: new UniqueEntityID(raw.deliveryAddressId),
        deliveryPersonId: new UniqueEntityID(
          raw.deliveryPersonId ?? raw.deliveryAddressId,
        ),
        imgUrl: raw.imgUrl,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
