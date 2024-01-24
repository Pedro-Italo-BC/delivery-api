import { UseCaseError } from '@/core/errors/use-case-error';

export class AdminAlredyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Admin alredy exists`);
  }
}
