import { DeliveryPersonAddressRepository } from '@/domain/delivery/application/repositories/delivery-person-address-repository';
import { DeliveryPersonAddress } from '@/domain/delivery/enterprise/entities/delivery-person-address';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryDeliveryPersonAddressRepository
  implements DeliveryPersonAddressRepository
{
  public items: DeliveryPersonAddress[] = [];

  async create(deliveyPersonAddress: DeliveryPersonAddress) {
    this.items.push(deliveyPersonAddress);
  }

  async findById(id: string) {
    const deliveyPersonAddress = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!deliveyPersonAddress) {
      return null;
    }

    return deliveyPersonAddress;
  }
  async deleteManyByDeliveryPersonId(deliveryPersonId: string): Promise<void> {
    const newItemsList = this.items.filter(
      (item) => item.deliveryPersonId.toString() !== deliveryPersonId,
    );

    this.items = newItemsList;
  }

  async save(address: DeliveryPersonAddress): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(address.id),
    );

    if (itemIndex === -1) {
      return;
    }

    this.items[itemIndex] = address;
  }
}
