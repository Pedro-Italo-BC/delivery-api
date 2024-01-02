import { DeliveryPersonRepository } from 'src/domain/delivery/application/repositories/delivery-person-repository';
import { DeliveryPerson } from 'src/domain/delivery/enterprise/entities/delivery-person';

export class InMemoryDeliveryPersonRepository
  implements DeliveryPersonRepository
{
  public items: DeliveryPerson[] = [];

  async create(deliveryPerson: DeliveryPerson) {
    this.items.push(deliveryPerson);
  }

  async delete(deliveryPerson: DeliveryPerson) {
    const newItemList = this.items.filter(
      (item) => !item.id.equals(deliveryPerson.id),
    );

    this.items = newItemList;
  }

  async findById(id: string) {
    const deliveryPerson = this.items.find((item) => item.id.toString() === id);

    if (!deliveryPerson) {
      return null;
    }

    return deliveryPerson;
  }

  async save(deliveryPerson: DeliveryPerson) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(deliveryPerson.id),
    );

    this.items[itemIndex] = deliveryPerson;
  }
}
