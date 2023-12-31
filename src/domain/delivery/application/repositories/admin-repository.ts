import { Admin } from '../../enterprise/entities/admin';
import { CPF } from '../../enterprise/entities/value-object/cpf';

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>;
  abstract delete(admin: Admin): Promise<void>;
  abstract save(admin: Admin): Promise<void>;
  abstract findById(id: string): Promise<Admin | null>;
  abstract findByCPF(cpf: CPF): Promise<Admin | null>;
}
