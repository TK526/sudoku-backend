import { IsString, IsInt, IsIn, Min, Max, IsNotEmpty } from 'class-validator';

export class RecordDto {
  @IsString()
  @IsNotEmpty() // Not an empty or blank string
  username: string;

  @IsInt()
  @Min(0) // Score needs to be greater than 0
  @Max(10000) // The maximum score
  score: number;

  @IsIn(['beginner', 'intermediate', 'hard', 'expert'])
  difficulty: string;
}
