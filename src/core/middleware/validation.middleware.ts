import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { HttpException } from '@exceptions/http-exception';

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any,
  skipMissingProperties = false,
  whitelist = false,
  forbidNonWhitelisted = false,
) => {
  return (request: Request, _response: Response, next: NextFunction) => {
    const dto = plainToInstance(type, request.body);
    validateOrReject(dto, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    })
      .then(() => {
        request.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        // Structuring the validation errors
        const formattedErrors = errors.reduce(
          (acc, error) => {
            const field = error.property;
            acc[field] = Object.values(error.constraints || {});
            return acc;
          },
          {} as Record<string, string[]>,
        );

        console.log(formattedErrors);

        next(new HttpException(400, 'Validation failed', formattedErrors));
      });
  };
};
