import {IsInt, Min, Max, IsUUID, IsNotEmpty} from 'class-validator';
  
  export class CheckValueGameDto {
    @IsInt()
    @Min(0)
    @Max(8)
    row: number;
  
    @IsInt()
    @Min(0)
    @Max(8)
    column: number;
  
    @IsInt()
    @Min(1)
    @Max(9)
    value: number;
  
    @IsUUID()
    @IsNotEmpty()
    gameId: string;
  }
  