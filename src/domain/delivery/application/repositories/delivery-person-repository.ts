import { DeliveryPerson } from '../../enterprise/entities/delivery-person';
import { DeliveryPersonAddress } from '../../enterprise/entities/delivery-person-address';
import { CPF } from '../../enterprise/entities/value-object/cpf';

export abstract class DeliveryPersonRepository {
  abstract create(deliveryPersonAndAdress: {
    deliveryPerson: DeliveryPerson;
    deliveryPersonAddress: DeliveryPersonAddress;
  }): Promise<void>;
  abstract delete(deliveryPerson: DeliveryPerson): Promise<void>;
  abstract save(deliveryPersonAndAdress: {
    deliveryPerson: DeliveryPerson;
    deliveryPersonAddress?: DeliveryPersonAddress;
  }): Promise<void>;
  abstract findById(id: string): Promise<DeliveryPerson | null>;
  abstract findByCPF(cpf: CPF): Promise<DeliveryPerson | null>;
}
