import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

describe('Register Delivery-Person (E2E)', () => {
  let app: INestApplication;
  let adminFactory: AdminFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [AdminFactory, PrismaService, JwtService],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    adminFactory = moduleRef.get(AdminFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /delivery-person', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/delivery-person')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpf: '12345678909',
        name: 'John Doe',
        password: '123456',

        addressInfo: {
          longitude: -10.4907302,
          latitude: -45.6221634,
        },
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '12345678909',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
