import { UseCaseError } from '@/core/errors/use-case-error';

export class DeliveryPersonDoesNotExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Delivery-Person with ID "${identifier}" does not exists`);
  }
}
