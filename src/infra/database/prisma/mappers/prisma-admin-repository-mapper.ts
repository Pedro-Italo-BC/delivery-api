import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Admin } from '@/domain/delivery/enterprise/entities/admin';
import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { Prisma, User as PrismaAdmin } from '@prisma/client';

export class PrismaAdminRepositoryMapper {
  static toDomain(raw: PrismaAdmin) {
    if (raw.role !== 'ADMIN') {
      throw new Error('Invalid user role.');
    }

    return Admin.create(
      {
        cpf: CPF.create(raw.cpf),
        name: raw.name,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      cpf: admin.cpf.value,
      name: admin.name,
      password: admin.password,
      role: 'ADMIN',
      id: admin.id.toString(),
    };
  }
}
