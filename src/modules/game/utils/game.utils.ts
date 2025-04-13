import { Cell } from "../interfaces/cell.interface";

  /**
   * Check if number is valid based on Sudoku rules (no repeating in rows, cols, subgrids)
   * @param grid 
   * @param row 
   * @param col 
   * @param num 
   * @param gridDimension 
   * @returns 
   */
  export function isValid(grid: number[][], row: number, col: number, num: number, gridDimension: number): boolean {
    // Check row
    for (let i = 0; i < gridDimension; i++) {
      if (grid[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < gridDimension; i++) {
      if (grid[i][col] === num) return false;
    }

    // Check subgrid
    const subgridSize = Math.sqrt(gridDimension);
    const startRow = Math.floor(row / subgridSize) * subgridSize;
    const startCol = Math.floor(col / subgridSize) * subgridSize;

    for (let i = startRow; i < startRow + subgridSize; i++) {
      for (let j = startCol; j < startCol + subgridSize; j++) {
        if (grid[i][j] === num) return false;
      }
    }

    return true;
  }


  /**
   * Selects a number at random and backtracks if not valid
   * @param grid 
   * @param gridDimension 
   * @returns 
   */
  export function solveSudoku(grid: number[][], gridDimension: number): boolean {
    for (let row = 0; row < gridDimension; row++) {
      for (let col = 0; col < gridDimension; col++) {
        if (grid[row][col] === 0) {
            //Create an array -> use to populate array with values/index values -> increment the values for 1-9 -> shuffle array
            const numbers = shuffleArray([...Array(gridDimension).keys()].map(n => n + 1));

            for (let num of numbers) {
              if (isValid(grid, row, col, num, gridDimension)) {
                grid[row][col] = num;
                if (solveSudoku(grid, gridDimension)) {
                  return true;
                }
                grid[row][col] = 0;
              }
            }            

          return false;
        }
      }
    }

    return true;
  }

  /**
   * Shuffle an array 
   * @param array 
   * @returns 
   */
  export function shuffle1DArray(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Initialises an empty list
   * @param userValue 
   * @returns 
   */
  export function createList(userValue: number): number[] {
    const list = [];
    for (let i = 1; i <= userValue; i++) {
      list.push(i);
    }
    return list;
  }

  /**
   * Creates an empty 2D list aka. Grid with all values set as 0
   * @param gridDimension 
   * @returns 
   */
  export function createEmptyGrid(gridDimension: number): number[][] {
    return Array.from({ length: gridDimension }, () =>
      Array(gridDimension).fill(0)
    );
  }

   /**
   * Maps 2D grid of number:number to 2D grid of Cell
   * @param grid 
   * @returns 
   * @deprecated
   */
  export function createCellGrid(grid: number[][]) {
    const cellGrid: Cell[][] = grid.map(row =>
        row.map(value => ({
          value,
          hidden: false
        }))
      );
    return cellGrid;
}
  
  /**
   * Get the range of visible cells based on difficulty
   * @param difficulty 
   * @param totalCells 
   * @returns 
   */
  export function getVisibleCellsRange(difficulty: string, totalCells: number): { min: number, max: number } {
    switch (difficulty) {
      case 'beginner':
        // return { min: 75, max: 79 }; //for testing
        return { min: 36, max: 40 };
      case 'intermediate':
        // return { min: 75, max: 79 }; //for testing
        return { min: 32, max: 36 };
      case 'hard':
        // return { min: 75, max: 79 }; //for testing
        return { min: 28, max: 32 };
      case 'expert':
        // return { min: 75, max: 79 }; //for testing
        return { min: 24, max: 28 };
      default:
        return { min: 36, max: 40 }; // Default to beginner
    }
  }
  
  /**
   * Create a hidden grid based on difficulty
   * @param grid The complete solved grid
   * @param difficulty The difficulty level
   * @returns A new grid with some values replaced by 0
   */
  export function createHiddenGrid(grid: number[][], difficulty: string): number[][] {
    const gridDimension = grid.length;
    const totalCells = gridDimension * gridDimension;
    
    // Create a deep copy of the grid
    const hiddenGrid = grid.map(row => [...row]);
    
    // Get visible cells range based on difficulty
    const visibleRange = getVisibleCellsRange(difficulty, totalCells);
    
    // Randomly select number of cells to show
    const visibleCells = Math.floor(
      Math.random() * (visibleRange.max - visibleRange.min + 1) + visibleRange.min
    );
    
    // Calculate how many cells to hide
    const cellsToHide = totalCells - visibleCells;
    
    // Create a list of all positions in the grid (array of coordinates)
    const positions = [];
    for (let row = 0; row < gridDimension; row++) {
      for (let col = 0; col < gridDimension; col++) {
        positions.push({ row, col });
      }
    }
    
    // Shuffle the positions
    const shuffledPositions = shuffleArray([...positions]);
    
    // Hide cells by setting values to 0
    for (let i = 0; i < cellsToHide; i++) {
      const position = shuffledPositions[i];
      hiddenGrid[position.row][position.col] = 0;
    }
    
    return hiddenGrid;
  }
  
  // Modified shuffleArray to handle position objects
  export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  /**
   * Create a cell grid with hidden values based on the hidden grid
   * @param grid Original complete grid
   * @param hiddenGrid Grid with hidden values (0s)
   * @returns Cell grid with proper hidden flags
   * @deprecated
   */
  export function createCellGridWithHidden(grid: number[][], hiddenGrid: number[][]): Cell[][] {
    const cellGrid: Cell[][] = grid.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value,
        hidden: hiddenGrid[rowIndex][colIndex] === 0
      }))
    );
    return cellGrid;
  }

  /**
 * Count visible numbers in a grid (non-zero values)
 * @param grid The grid to count visible numbers in
 * @returns Number of visible cells (non-zero values)
 */
export function countVisibleNumbers(grid: number[][]): number {
    let count = 0;
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] !== 0) {
          count++;
        }
      }
    }
    
    return count;
  }