import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AdminFactory } from 'test/factories/make-admin';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';

describe('Create Order (E2E)', () => {
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

  test('[POST] /orders', async () => {
    const admin = await adminFactory.makePrismaAdmin();

    const accessToken = jwt.sign({ sub: admin.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'order-title',
        content: 'order-content',

        deliveryAddress: {
          longitude: -10.4907302,
          latitude: -45.6221634,
        },

        currentAddress: {
          longitude: -10.4907302,
          latitude: -45.6221634,
        },
      });

    expect(response.statusCode).toBe(201);

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        title: 'order-title',
      },
    });

    expect(orderOnDatabase).toBeTruthy();
  });
});
