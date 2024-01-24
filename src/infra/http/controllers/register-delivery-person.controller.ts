import { RegisterDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/register-delivery-person';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeliveryPersonAlredyExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-person-alredy-exists';

const registerDeliveryPersonBodySchema = z.object({
  cpf: z.string(),
  name: z.string(),
  password: z.string(),

  addressInfo: z.object({
    longitude: z.number(),
    latitude: z.number(),
  }),
});

type RegisterDeliveryPersonBodySchema = z.infer<
  typeof registerDeliveryPersonBodySchema
>;

const bodyValidationPipe = new ZodValidationPipe(
  registerDeliveryPersonBodySchema,
);

@Controller('/delivery-person')
export class RegisterDeliveryPersonController {
  constructor(private registerDeliveryPerson: RegisterDeliveryPersonUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: RegisterDeliveryPersonBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { addressInfo, cpf, name, password } = body;
    const adminId = user.sub;

    const result = await this.registerDeliveryPerson.execute({
      addressInfo,
      adminId,
      cpf,
      name,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException();
        case DeliveryPersonAlredyExistsError:
          throw new ConflictException();
      }
    }
  }
}
