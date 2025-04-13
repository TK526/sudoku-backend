// Deprecated
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'IsPerfectSquare', async: false })
  export class IsPerfectSquareConstraint implements ValidatorConstraintInterface {
    validate(value: number, args: ValidationArguments): boolean {
      const sqrt = Math.sqrt(value);
      return Number.isInteger(sqrt);
    }
  
    defaultMessage(args: ValidationArguments): string {
      return 'gridDimension must be a perfect square (e.g., 9, 16, 25)';
    }
  }
  