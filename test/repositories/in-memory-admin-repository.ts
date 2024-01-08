import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { AdminRepository } from 'src/domain/delivery/application/repositories/admin-repository';
import { Admin } from 'src/domain/delivery/enterprise/entities/admin';

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = [];

  async create(admin: Admin) {
    this.items.push(admin);
  }

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id);

    if (!admin) {
      return null;
    }

    return admin;
  }

  async delete(admin: Admin) {
    const newItemList = this.items.filter((item) => !item.id.equals(admin.id));

    this.items = newItemList;
  }

  async save(admin: Admin) {
    const findItemIndex = this.items.findIndex((item) =>
      item.id.equals(admin.id),
    );

    if (findItemIndex === -1) {
      return;
    }

    this.items[findItemIndex] = admin;
  }

  async findByCPF(cpf: CPF) {
    const admin = this.items.find((item) => item.cpf.equals(cpf));

    if (!admin) {
      return null;
    }

    return admin;
  }
}
