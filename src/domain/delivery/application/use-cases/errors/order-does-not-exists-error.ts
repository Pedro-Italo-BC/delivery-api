import { UseCaseError } from '@/core/errors/use-case-error';

export class OrderDoesNotExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Order with ID "${identifier}" does not exists`);
  }
}
