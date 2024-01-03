import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { EditAdminUseCase } from './edit-admin';

let adminRepository: InMemoryAdminRepository;
let hasher: FakeHasher;
let sut: EditAdminUseCase;

describe('Edit Admin', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    hasher = new FakeHasher();
    sut = new EditAdminUseCase(adminRepository, hasher);
  });

  it('should be able to edit an admin', async () => {
    const passwordHashed = await hasher.hash('123456');

    const admin = makeAdmin({
      password: passwordHashed,
    });

    await adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      newName: 'New-Admin-Name',
      newPassword: 'New-Admin-Password',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      admin: adminRepository.items[0],
    });
  });

  it('should not be able to edit an admin with wrong password', async () => {
    const admin = makeAdmin({
      password: '123456',
    });

    await adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      newName: 'New-Admin-Name',
      newPassword: 'New-Admin-Password',
      password: 'Wrong-Admin-Password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit an admin if resource does not exist', async () => {
    const passwordHashed = await hasher.hash('123456');

    const admin = makeAdmin({
      password: passwordHashed,
    });

    await adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: 'Wrong-Admin-Id',
      newName: 'New-Admin-Name',
      newPassword: 'New-Admin-Password',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
