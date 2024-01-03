import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';

import { DeleteAdminUseCase } from './delete-admin';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let adminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let sut: DeleteAdminUseCase;

describe('Delete Admin', () => {
  beforeEach(() => {
    adminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    sut = new DeleteAdminUseCase(adminRepository, fakeHasher);
  });

  it('should be able to delete a admin', async () => {
    const hashedPassword = await fakeHasher.hash('12345');
    const admin = makeAdmin({
      password: hashedPassword,
    });

    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      password: '12345',
    });

    console.log(result);

    expect(result.isRight()).toBe(true);
    expect(adminRepository.items.length).toEqual(0);
  });

  it('should not be able to delete a delivery-person with wrong password', async () => {
    const admin = makeAdmin({ password: '123456' });

    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: admin.id.toString(),
      password: 'wrong-password',
    });

    expect(result.isLeft()).toEqual(true);
    expect(adminRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete a delivery-person with wrong delivery-person id', async () => {
    const hashedPassword = await fakeHasher.hash('12345');
    const admin = makeAdmin({
      password: hashedPassword,
    });

    adminRepository.items.push(admin);

    const result = await sut.execute({
      adminId: 'wrong-id',
      password: '123456',
    });

    expect(result.isLeft()).toEqual(true);
    expect(adminRepository.items.length).toEqual(1);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
