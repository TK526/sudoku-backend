import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CheckValueGameDto } from './dto/check-score-game.dto';
import { CheckGameInformationDto } from './dto/check-game-information.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  //Done
  @Post('create')
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Post('completed')
  isGameCompleted(@Body() checkGameInfoDto: CheckGameInformationDto) {
    return this.gameService.isGameCompleted(checkGameInfoDto);
  }

  //Done
  @Post('value')
  checkValue(@Body() checkValueGameDto: CheckValueGameDto) {
    return this.gameService.checkValue(checkValueGameDto);
  }

  //Done
  @Post('hint')
  checkHintLimitAndReturnValue(@Body() CheckGameInformationDto: CheckGameInformationDto) {
    return this.gameService.checkHintLimitAndReturnValue(CheckGameInformationDto);
  }

  //Done
  @Post('score')
  getScore(@Body() getScoreDto: CheckGameInformationDto) {
    return this.gameService.getScore(getScoreDto);
  }
}

/**
 * Backend breakdown for step by step
 * Create a 9 x 9 grid for a sudoku game
 * beginner difficulty means 36-40 cells visible
 * intermediate difficulty means 32-36 cells visible
 * hard difficulty means 28-32 cells visible
 * expert difficulty means 24-28 cells visible
 * 
 * We should ask the user for difficulty and then return this grid.
 * We need to know which cells are returned as visible
 * We need to have a property on the cells to know which cell was suggested as a hint so that we dont repeat
 * The game will be randomly generated each time
 * 
 * Error cell will be detected in real time as soon as user enters a value
 * 
 */

/**
 * I will create a AxA grid
 * Populate this AxA grid
 * Set X values based on difficulty as hidden: true
 * Create a new AxA grid where we will only place not hidden values -> return this to front end
 * Store our correct grid in the database
 */