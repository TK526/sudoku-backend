import { IsString, IsInt, IsIn, Min, IsNotEmpty, Validate } from 'class-validator';
import { IsPerfectSquareConstraint } from '../validator/custom-game.validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['beginner', 'intermediate', 'hard', 'expert'])
  difficulty: string;

  @IsInt()
  @Min(3)
  @Validate(IsPerfectSquareConstraint)
  gridDimension: number;
}
