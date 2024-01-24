import { UseCaseError } from '@/core/errors/use-case-error';

export class DeliveryPersonAlredyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super(`Delivery-Person alredy exists`);
  }
}
