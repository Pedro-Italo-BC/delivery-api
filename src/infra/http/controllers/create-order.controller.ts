import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation';
import { CreateOrderUseCase } from '@/domain/delivery/application/use-cases/create-order';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

const createOrderBodySchema = z.object({
  title: z.string(),
  content: z.string(),

  currentAddress: z.object({
    longitude: z.number(),
    latitude: z.number(),
  }),
  deliveryAddress: z.object({
    longitude: z.number(),
    latitude: z.number(),
  }),
});

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema);

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateOrderBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, currentAddress, deliveryAddress, title } = body;
    const adminId = user.sub;

    const result = await this.createOrder.execute({
      adminId,
      content,
      currentAddress,
      deliveryAddress,
      title,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        default:
          throw new BadRequestException();
      }
    }

    const { order } = result.value;

    return {
      order,
    };
  }
}
