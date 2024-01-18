import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeliveryPerson } from '@/domain/delivery/enterprise/entities/delivery-person';
import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { Prisma, User as PrismaDeliveryPerson } from '@prisma/client';

export class PrismaDeliveryPersonMapper {
  static toPrisma(
    deliveryPerson: DeliveryPerson,
  ): Prisma.UserUncheckedCreateInput {
    return {
      cpf: deliveryPerson.cpf.value,
      name: deliveryPerson.name,
      password: deliveryPerson.password,
      addressId: deliveryPerson.addressId.toString(),
      role: 'DELIVERY_PERSON',
    };
  }

  static toDomain(raw: PrismaDeliveryPerson): DeliveryPerson {
    return DeliveryPerson.create({
      cpf: CPF.create(raw.cpf),
      name: raw.name,
      password: raw.password,
      addressId: new UniqueEntityID(raw.addressId as string),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
