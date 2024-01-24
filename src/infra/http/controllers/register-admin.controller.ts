import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation';
import { RegisterAdminUseCase } from '@/domain/delivery/application/use-cases/register-admin';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { DeliveryPersonAlredyExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-person-alredy-exists';
import { Public } from '@/infra/auth/public';

const registerAdminBodySchema = z.object({
  cpf: z.string(),
  name: z.string(),
  password: z.string(),
});

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(registerAdminBodySchema);

@Controller('/admin')
@Public()
export class RegisterAdminController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: RegisterAdminBodySchema) {
    const { cpf, name, password } = body;

    const result = await this.registerAdmin.execute({
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
        default:
          throw new BadRequestException();
      }
    }
  }
}
