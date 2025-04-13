import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { 
  createEmptyGrid, 
  solveSudoku,
  createHiddenGrid,
  countVisibleNumbers
} from './utils/game.utils';
import { Game } from './entities/game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckValueGameDto } from './dto/check-score-game.dto';
import { CheckGameInformationDto } from './dto/check-game-information.dto';

const MS_IN_ONE_SECOND = 1000;
const GRACE_POINTS = 500;

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) 
    private readonly gameRepository: Repository<Game>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const gridDimension = createGameDto.gridDimension;
    const difficulty = createGameDto.difficulty;
  
    // Create empty grid
    let grid = createEmptyGrid(gridDimension);
  
    // Use backtrack logic to bruteforce and create a grid
    solveSudoku(grid, gridDimension);
  
    Logger.debug(`Generated Sudoku Grid (Solved)`, GameService.name);
    // Uncomment for visualising grid and hidden grid
    // grid.forEach((row, index) => {
    //   Logger.debug(`Row ${index + 1}: ${row.join(" | ")}`, GameService.name);
    // });

    // Create hidden grid based on difficulty
    const hiddenGrid = createHiddenGrid(grid, difficulty);
    
    // Count visible numbers
    const visibleCount = countVisibleNumbers(hiddenGrid);
    
    Logger.debug(`Generated Sudoku Grid (Hidden) with visible numbers: ${visibleCount}`, GameService.name);
    
    const newGame = this.gameRepository.create({
      grid: grid,
      hintsUsed: 0,
      errors: 0,
      corrects: 0,
      currentGrid: hiddenGrid,
      difficulty: difficulty,
      startedAt: new Date(),
      visibleValuesCount: visibleCount
    });
    
    // Add a new record to the database
    const savedGame = await this.gameRepository.save(newGame);

    return {
      gameId: savedGame.id,
      hiddenGrid: savedGame.currentGrid,
      visibleCount: savedGame.visibleValuesCount
    };
  }  

  async checkValue(checkValueGameDto: CheckValueGameDto) {
    const myGame = await this.gameRepository.findOneBy({ id: checkValueGameDto.gameId });

    //Throw exception if game is not found
    if (!myGame) {
      throw new NotFoundException('Game not found');
    }    
    
    //Note for self: user may send a value that is already mapped, but wont affect fe because no need to check values that are not previously 0
    if(myGame.grid[checkValueGameDto.row][checkValueGameDto.column] === checkValueGameDto.value){
      //update the value on current grid
      myGame.currentGrid[checkValueGameDto.row][checkValueGameDto.column] = checkValueGameDto.value;
      myGame.visibleValuesCount++;
      myGame.corrects++;

      await this.gameRepository.save(myGame);
      return {
        correct: true,
        visibleValuesCount: myGame.visibleValuesCount,
        errors: myGame.errors,
        correctCount: myGame.corrects
      };
    }
    else {
      //update the value on current grid
      myGame.currentGrid[checkValueGameDto.row][checkValueGameDto.column] = checkValueGameDto.value;
      myGame.errors++;

      await this.gameRepository.save(myGame);
      return {
        correct: false,
        visibleValuesCount: myGame.visibleValuesCount,
        errors: myGame.errors,
        correctCount: myGame.corrects
      };
    }
  }  

  async checkHintLimitAndReturnValue(checkGameInformationDto: CheckGameInformationDto) {
    const myGame = await this.gameRepository.findOneBy({ id: checkGameInformationDto.gameId });

    //Throw exception if game is not found
    if (!myGame) {
      throw new NotFoundException('Game not found');
    }    

    if (myGame.hintsUsed >= 10) {
      return {
        error: 'Maximum hints used',
        hintsUsed: myGame.hintsUsed,
        maxHints: 10
      };
    }

    if (myGame.visibleValuesCount >= 81) {
      return {
        error: 'Puzzle is completed',
        hintsUsed: myGame.hintsUsed,
        visibleValuesCount: myGame.visibleValuesCount
      };
    }
    
    if (myGame.hintsUsed < 10 && myGame.visibleValuesCount < 81) {
      let correctValue;
      let correctRow;
      let correctColumn;

      // Find all empty cells (cells with value 0)
      const emptyCells: { row: number, col: number }[] = [];
      for (let row = 0; row < myGame.currentGrid.length; row++) {
        for (let col = 0; col < myGame.currentGrid[row].length; col++) {
          if (myGame.currentGrid[row][col] === 0) {
            emptyCells.push({ row, col }); // Storing the row and column indices of empty cells into new array
          }
        }
      }

      // If there are any empty cells, select one randomly
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
    
        // Get the correct value from the grid (the full, solved grid)
        correctValue = myGame.grid[row][col];
        correctRow = row;
        correctColumn = col;
        
        // Update the currentGrid with the correct value
        myGame.currentGrid[row][col] = correctValue;
      }
    
      // Save the updated game state
      myGame.hintsUsed++;
      myGame.visibleValuesCount++;

      await this.gameRepository.save(myGame);
    
      return {
        rowIndex: correctRow,
        columnIndex: correctColumn,
        value: correctValue,
        visibleValuesCount: myGame.visibleValuesCount
      };
    } else {
      return false;
    }
  }  
  
  async getScore(getScore: CheckGameInformationDto) {
    const myGame = await this.gameRepository.findOneBy({ id: getScore.gameId });
  
    //Throw exception if game is not found
    if (!myGame) {
      throw new NotFoundException('Game not found');
    }    
    
    // To calculate difference in time
    let currentTime = new Date();
  
    let correctScore = myGame.corrects * 5;
    Logger.debug(`Correct Score: ${correctScore}`, GameService.name);
  
    let errorScore = myGame.errors * 1;
    Logger.debug(`Error Score: ${errorScore}`, GameService.name);
  
    let hintsNegativeScoring = 0; // Initialize to 0 to avoid undefined value
    for (let count = 0; count <= myGame.hintsUsed; count++) {
      hintsNegativeScoring = hintsNegativeScoring + 3 + count;
    }
    Logger.debug(`Hints Negative Scoring: ${hintsNegativeScoring}`, GameService.name);

    // Calculate time difference in seconds
    // Note: getTime() returns the time in milliseconds since 1970-01-01T00:00:00Z
    // So we divide by 1000 to convert to seconds
    let timeDifferenceInSeconds = (currentTime.getTime() - myGame.startedAt.getTime()) / MS_IN_ONE_SECOND;
    Logger.debug(`Time Difference (seconds): ${timeDifferenceInSeconds}`, GameService.name);

    // Calculate time bonus
    // If timeDifferenceInSeconds is greater than GRACE_POINTS, no bonus is given
    let timeBonus = Math.round(GRACE_POINTS - timeDifferenceInSeconds);
    Logger.debug(`Time Bonus: ${timeBonus}`, GameService.name);

    let totalScore = correctScore - (errorScore + hintsNegativeScoring) + (timeBonus > 0 ? timeBonus : 0);
    Logger.debug(`Total Score: ${totalScore}`, GameService.name);

    // Ensure totalScore is not negative
    if (totalScore < 0) {
      totalScore = 0;
    }
    
    return totalScore;
  }  

  async isGameCompleted(checkGameInformationDto: CheckGameInformationDto){
    const game = await this.gameRepository.findOneBy({ id: checkGameInformationDto.gameId });
  
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    
    // Check if all cells are filled (no zeros in currentGrid)
    for (let row = 0; row < game.currentGrid.length; row++) {
      for (let col = 0; col < game.currentGrid[row].length; col++) {
        if (game.currentGrid[row][col] === 0) {
          return false;
        }
      }
    }
    
    // Check if all filled values are correct (match the solution grid)
    for (let row = 0; row < game.currentGrid.length; row++) {
      for (let col = 0; col < game.currentGrid[row].length; col++) {
        if (game.currentGrid[row][col] !== game.grid[row][col]) {
          return false;
        }
      }
    }
    
    return true;
  }
}