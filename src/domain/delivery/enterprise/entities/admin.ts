import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { CPF } from './value-object/cpf';

export interface AdminProps {
  cpf: CPF;
  name: string;
  password: string;
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id);

    return admin;
  }
}
