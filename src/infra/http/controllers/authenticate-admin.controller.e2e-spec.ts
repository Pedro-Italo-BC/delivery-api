import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { CPF } from '@/domain/delivery/enterprise/entities/value-object/cpf';
import { hash } from 'bcryptjs';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Authenticate Admin (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdminFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    adminFactory = moduleRef.get(AdminFactory);

    await app.init();
  });

  test('[POST] /sessions/admin', async () => {
    await adminFactory.makePrismaAdmin({
      cpf: CPF.create('12345678909'),
      name: 'John Doe',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer())
      .post('/sessions/admin')
      .send({
        cpf: '12345678909',
        password: '123456',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
