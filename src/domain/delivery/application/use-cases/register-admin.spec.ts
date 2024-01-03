import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { RegisterAdminUseCase } from './register-admin';

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
});
