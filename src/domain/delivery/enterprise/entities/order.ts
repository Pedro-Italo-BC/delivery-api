import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface OrderProps {
  name: string;
  content: string;
  deliveryPersonId: UniqueEntityID;
  adminId: UniqueEntityID;
  addressId: UniqueEntityID;
  createAt: Date;
  updatedAt?: Date | null;
}

export class Order extends Entity<OrderProps> {
  static create(props: OrderProps, id?: UniqueEntityID) {
    const order = new Order(props, id);

    return order;
  }
}
