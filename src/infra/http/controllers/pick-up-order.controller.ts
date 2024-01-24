import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('/orders/:orderId')
export class PickUpOrderController {
  constructor(private pickUpOrder: PickUpOrderUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const deliveryPersonId = user.sub;

    const result = await this.pickUpOrder.execute({
      deliveryPersonId,
      orderId,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException();
        case NotAllowedError:
          throw new UnauthorizedException();
        default:
          throw new BadRequestException();
      }
    }
  }
}
