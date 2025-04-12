import {IsUUID, IsNotEmpty} from 'class-validator';
  
  export class CheckGameInformationDto {
    @IsUUID()
    @IsNotEmpty()
    gameId: string;
  }
  