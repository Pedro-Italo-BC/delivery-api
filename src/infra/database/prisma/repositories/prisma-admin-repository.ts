import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { Admin } from '@/domain/delivery/enterprise/entities/admin';
import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { Injectable } from '@nestjs/common';
import { PrismaAdminRepositoryMapper } from '../mappers/prisma-admin-repository-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminRepositoryMapper.toPrisma(admin);

    await this.prisma.user.create({ data });
  }
  async delete(admin: Admin): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: admin.id.toString(),
      },
    });
  }
  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminRepositoryMapper.toPrisma(admin);

    await this.prisma.user.update({
      where: {
        id: admin.id.toString(),
      },
      data,
    });
  }
  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    return admin ? PrismaAdminRepositoryMapper.toDomain(admin) : null;
  }
  async findByCPF(cpf: CPF): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf: cpf.value,
      },
    });
    return admin ? PrismaAdminRepositoryMapper.toDomain(admin) : null;
  }
}
