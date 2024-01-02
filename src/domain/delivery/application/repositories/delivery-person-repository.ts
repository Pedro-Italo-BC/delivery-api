import { DeliveryPerson } from '../../enterprise/entities/delivery-person';

export abstract class DeliveryPersonRepository {
  abstract create(deliveryPerson: DeliveryPerson): Promise<void>;
  abstract delete(deliveryPerson: DeliveryPerson): Promise<void>;
  abstract save(deliveryPerson: DeliveryPerson): Promise<void>;
  abstract findById(id: string): Promise<DeliveryPerson | null>;
}
