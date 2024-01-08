import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateAdminUseCase } from './authenticate-admin';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let adminRepository: InMemoryAdminRepository;
let hasher: FakeHasher;
let encrypter: FakeEncrypter;
let sut: AuthenticateAdminUseCase;

describe('Authenticate Admin', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    hasher = new FakeHasher();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateAdminUseCase(adminRepository, hasher, encrypter);
  });

  it('should be able to authenticate an admin', async () => {
    const passwordHashed = await hasher.hash('123456');

    const admin = makeAdmin({
      password: passwordHashed,
    });

    await adminRepository.items.push(admin);

    const result = await sut.execute({
      cpf: admin.cpf.value,
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate an admin with wrong cpf', async () => {
    const passwordHashed = await hasher.hash('123456');

    const admin = makeAdmin({
      password: passwordHashed,
    });

    await adminRepository.items.push(admin);

    const result = await sut.execute({
      cpf: 'wrong-cpf',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(WrongCredentialsError);
  });

  it('should not be able to authenticate an admin with wrong password', async () => {
    const passwordHashed = await hasher.hash('123456');

    const admin = makeAdmin({
      password: passwordHashed,
    });

    adminRepository.items.push(admin);

    const result = await sut.execute({
      cpf: admin.cpf.value,
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(WrongCredentialsError);
  });
});
