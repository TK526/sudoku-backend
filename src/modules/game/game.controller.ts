import { Controller, Post, Body, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CheckValueGameDto } from './dto/check-score-game.dto';
import { CheckGameInformationDto } from './dto/check-game-information.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('create')
  create(@Body() createGameDto: CreateGameDto) {
    Logger.log(`Entering create game endpoint, with body ${JSON.stringify(createGameDto)}`, GameController.name);
    return this.gameService.create(createGameDto);
  }

  @Post('completed')
  isGameCompleted(@Body() checkGameInfoDto: CheckGameInformationDto) {
    Logger.log(`Entering isGameCompleted endpoint, with body ${JSON.stringify(checkGameInfoDto)}`, GameController.name);
    return this.gameService.isGameCompleted(checkGameInfoDto);
  }

  @Post('value')
  checkValue(@Body() checkValueGameDto: CheckValueGameDto) {
    Logger.log(`Entering checkValue endpoint, with body ${JSON.stringify(checkValueGameDto)}`, GameController.name);
    return this.gameService.checkValue(checkValueGameDto);
  }

  @Post('hint')
  checkHintLimitAndReturnValue(@Body() CheckGameInformationDto: CheckGameInformationDto) {
    Logger.log(`Entering checkHintLimitAndReturnValue endpoint, with body ${JSON.stringify(CheckGameInformationDto)}`, GameController.name);
    return this.gameService.checkHintLimitAndReturnValue(CheckGameInformationDto);
  }

  @Post('score')
  getScore(@Body() getScoreDto: CheckGameInformationDto) {
    Logger.log(`Entering getScore endpoint, with body ${JSON.stringify(getScoreDto)}`, GameController.name);
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