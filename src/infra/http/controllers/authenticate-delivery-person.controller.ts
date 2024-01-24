import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation';
import { Public } from '@/infra/auth/public';
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error';
import { AuthenticateDeliveryPersonUseCase } from '@/domain/delivery/application/use-cases/authenticate-delivery-person';

const authenticateDeliveryPersonBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

type AuthenticateDeliveryPersonBodySchema = z.infer<
  typeof authenticateDeliveryPersonBodySchema
>;

const bodyValidationPipe = new ZodValidationPipe(
  authenticateDeliveryPersonBodySchema,
);

@Public()
@Controller('/sessions/delivery-person')
export class AuthenticateDeliveryPersonController {
  constructor(
    private authenticateDeliveryPerson: AuthenticateDeliveryPersonUseCase,
  ) {}

  @HttpCode(200)
  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateDeliveryPersonBodySchema,
  ) {
    const { cpf, password } = body;

    const result = await this.authenticateDeliveryPerson.execute({
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new NotFoundException();
        default:
          throw new BadRequestException();
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
