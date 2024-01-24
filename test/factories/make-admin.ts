import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { PrismaAdminRepositoryMapper } from '@/infra/database/prisma/mappers/prisma-admin-repository-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  Admin,
  AdminProps,
} from 'src/domain/delivery/enterprise/entities/admin';
import { generateFakeCPF } from 'test/utils/generate-fake-cpf';

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
) {
  const admin = Admin.create(
    {
      cpf: CPF.create(generateFakeCPF()),
      name: faker.person.firstName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return admin;
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}): Promise<Admin> {
    const admin = makeAdmin(data);

    await this.prisma.user.create({
      data: PrismaAdminRepositoryMapper.toPrisma(admin),
    });

    return admin;
  }
}
