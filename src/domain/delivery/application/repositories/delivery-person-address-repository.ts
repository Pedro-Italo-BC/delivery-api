import { DeliveryPersonAddress } from '../../enterprise/entities/delivery-person-address';

export abstract class DeliveryPersonAddressRepository {
  abstract create(address: DeliveryPersonAddress): Promise<void>;
  abstract deleteManyByDeliveryPersonId(
    deliveryPersonId: string,
  ): Promise<void>;
  abstract findById(id: string): Promise<DeliveryPersonAddress | null>;
  abstract save(address: DeliveryPersonAddress): Promise<void>;
}
