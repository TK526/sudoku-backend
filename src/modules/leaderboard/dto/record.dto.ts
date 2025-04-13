import { IsString, IsInt, IsIn, Min, IsNotEmpty } from 'class-validator';

export class RecordDto {
  @IsString()
  @IsNotEmpty() // Not an empty or blank string
  username: string;

  @IsInt()
  @Min(0) // Score needs to be greater than 0
  score: number;

  @IsIn(['beginner', 'intermediate', 'hard', 'expert'])
  difficulty: string;
}
