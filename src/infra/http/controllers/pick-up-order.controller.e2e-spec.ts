import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DeliveryPersonFactory } from 'test/factories/make-delivery-person';
import { OrderFactory } from 'test/factories/make-order';
import { OrderAddressFactory } from 'test/factories/make-order-address';

describe('Pick Up Order (E2E)', () => {
  let app: INestApplication;
  let deliveryPersonFactory: DeliveryPersonFactory;
  let orderFactory: OrderFactory;
  let orderAddressFactory: OrderAddressFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [
        DeliveryPersonFactory,
        OrderFactory,
        OrderAddressFactory,
        PrismaService,
        JwtService,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    deliveryPersonFactory = moduleRef.get(DeliveryPersonFactory);
    orderFactory = moduleRef.get(OrderFactory);
    orderAddressFactory = moduleRef.get(OrderAddressFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /orders/:orderId', async () => {
    const delivery = await deliveryPersonFactory.makePrismaDeliveryPerson();
    const orderAddress = await orderAddressFactory.makePrismaOrderAddress();

    const order = await orderFactory.makePrismaOrder({
      deliveryAddressId: orderAddress.id,
      currentAddressId: orderAddress.id,
    });

    const orderId = order.id.toString();

    const accessToken = jwt.sign({ sub: delivery.id.toString() });

    const response = await request(app.getHttpServer())
      .patch(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    expect(orderOnDatabase?.status).toEqual('PICKED_UP');
  });
});
