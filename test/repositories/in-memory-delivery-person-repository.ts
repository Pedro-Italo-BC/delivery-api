import { DeliveryPersonRepository } from 'src/domain/delivery/application/repositories/delivery-person-repository';
import { DeliveryPerson } from 'src/domain/delivery/enterprise/entities/delivery-person';
import { InMemoryDeliveryPersonAddressRepository } from './in-memory-delivery-person-address-repository';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryDeliveryPersonRepository
  implements DeliveryPersonRepository
{
  public items: DeliveryPerson[] = [];

  constructor(
    private inMemoryDeliveryPersonAddressRepository: InMemoryDeliveryPersonAddressRepository,
  ) {}

  async create({
    deliveryPerson,
    deliveryPersonAddress,
  }: {
    deliveryPerson: DeliveryPerson;
    deliveryPersonAddress: DeliveryPersonAddress;
  }): Promise<void> {
    this.items.push(deliveryPerson);
    await this.inMemoryDeliveryPersonAddressRepository.save(
      deliveryPersonAddress,
    );
  }

  async delete(deliveryPerson: DeliveryPerson) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    );

    this.items.splice(itemIndex, 1);

    this.inMemoryDeliveryPersonAddressRepository.deleteManyByDeliveryPersonId(
      deliveryPerson.id.toString(),
    );
  }

  async findById(id: string) {
    const deliveryPerson = this.items.find((item) => item.id.toString() === id);

    if (!deliveryPerson) {
      return null;
    }

    return deliveryPerson;
  }

  async findByCPF(cpf: CPF) {
    const deliveryPerson = this.items.find((item) => item.cpf.equals(cpf));

    if (!deliveryPerson) {
      return null;
    }

    return deliveryPerson;
  }

  async save({
    deliveryPerson,
    deliveryPersonAddress,
  }: {
    deliveryPerson: DeliveryPerson;
    deliveryPersonAddress?: DeliveryPersonAddress;
  }) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(deliveryPerson.id),
    );

    if (itemIndex === -1) {
      return;
    }

    this.items[itemIndex] = deliveryPerson;

    if (deliveryPersonAddress) {
      await this.inMemoryDeliveryPersonAddressRepository.create(
        deliveryPersonAddress,
      );
    }
  }
}
