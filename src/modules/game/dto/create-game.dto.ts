import { IsString, IsInt, IsIn, Min, IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['beginner', 'intermediate', 'hard', 'expert'])
  difficulty: string;

  @IsInt()
  @Min(3)
  // @Validate(IsPerfectSquareConstraint) //Deprecated
  gridDimension: number;
}
