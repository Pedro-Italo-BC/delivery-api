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
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/use-cases/authenticate-admin';
import { Public } from '@/infra/auth/public';
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error';

const authenticateAdminBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

type AuthenticateAdminBodySchema = z.infer<typeof authenticateAdminBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(authenticateAdminBodySchema);

@Public()
@Controller('/sessions/admin')
export class AuthenticateAdminController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @HttpCode(200)
  @Post()
  async handle(@Body(bodyValidationPipe) body: AuthenticateAdminBodySchema) {
    const { cpf, password } = body;

    const result = await this.authenticateAdmin.execute({
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
