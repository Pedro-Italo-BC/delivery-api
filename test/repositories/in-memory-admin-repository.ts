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
}
