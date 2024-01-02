import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export interface AdminProps {
  cpf: string;
  name: string;
  password: string;
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id);

    return admin;
  }
}
