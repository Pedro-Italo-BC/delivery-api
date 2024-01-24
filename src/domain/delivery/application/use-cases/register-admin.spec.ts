import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { RegisterAdminUseCase } from './register-admin';
import { makeAdmin } from 'test/factories/make-admin';
import { CPF } from '../../enterprise/entities/value-object/cpf';
import { AdminAlredyExistsError } from './errors/admin-alredy-exists';

let adminRepository: InMemoryAdminRepository;
let hashGenerator: FakeHasher;
let sut: RegisterAdminUseCase;

describe('Register Admin', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    hashGenerator = new FakeHasher();
    sut = new RegisterAdminUseCase(adminRepository, hashGenerator);
  });

  it('should be able to register a admin', async () => {
    const result = await sut.execute({
      cpf: '12345678909',
      name: 'John Doe',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      admin: adminRepository.items[0],
    });
  });

  it('should not be able to register a admin if admin alredy exists', async () => {
    const admin = makeAdmin({
      cpf: CPF.create('12345678909'),
    });

    adminRepository.items.push(admin);

    const result = await sut.execute({
      cpf: '12345678909',
      name: 'John Doe',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(AdminAlredyExistsError);
  });
});
