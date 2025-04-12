import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '../../src/modules/game/game.controller';
import { GameService } from '../../src/modules/game/game.service';
import { CreateGameDto } from '../../src/modules/game/dto/create-game.dto';
import { CheckValueGameDto } from '../../src/modules/game/dto/check-score-game.dto';
import { CheckGameInformationDto } from '../../src/modules/game/dto/check-game-information.dto';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;

  // Mock service implementation
  const mockGameService = {
    create: jest.fn(),
    checkValue: jest.fn(),
    checkHintLimitAndReturnValue: jest.fn(),
    getScore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: mockGameService,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call gameService.create with the correct parameters', () => {
      // Arrange
      const createGameDto: CreateGameDto = {
        difficulty: 'beginner',
        gridDimension: 9,
      };
      const expectedResult = { hiddenGrid: [[1, 2], [3, 4]], visibleCount: 4 };
      mockGameService.create.mockReturnValue(expectedResult);

      // Act
      const result = controller.create(createGameDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createGameDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle different difficulty levels', () => {
      // Arrange
      const difficulties = ['beginner', 'intermediate', 'hard', 'expert'];
      
      difficulties.forEach(difficulty => {
        const createGameDto: CreateGameDto = {
          difficulty,
          gridDimension: 9,
        };
        const expectedResult = { hiddenGrid: [[1, 2], [3, 4]], visibleCount: 4 };
        mockGameService.create.mockReturnValue(expectedResult);

        // Act
        const result = controller.create(createGameDto);

        // Assert
        expect(service.create).toHaveBeenCalledWith(createGameDto);
        expect(result).toEqual(expectedResult);
      });
    });

    it('should handle different grid dimensions', () => {
      // Arrange
      const dimensions = [4, 9, 16];
      
      dimensions.forEach(dimension => {
        const createGameDto: CreateGameDto = {
          difficulty: 'beginner',
          gridDimension: dimension,
        };
        const expectedResult = { hiddenGrid: [[1, 2], [3, 4]], visibleCount: 4 };
        mockGameService.create.mockReturnValue(expectedResult);

        // Act
        const result = controller.create(createGameDto);

        // Assert
        expect(service.create).toHaveBeenCalledWith(createGameDto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('checkValue', () => {
    it('should call gameService.checkValue with the correct parameters', () => {
      // Arrange
      const checkValueGameDto: CheckValueGameDto = {
        row: 0,
        column: 0,
        value: 5,
        gameId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const expectedResult = { isCorrect: true };
      mockGameService.checkValue.mockReturnValue(expectedResult);

      // Act
      const result = controller.checkValue(checkValueGameDto);

      // Assert
      expect(service.checkValue).toHaveBeenCalledWith(checkValueGameDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle different cell positions', () => {
      // Test various positions
      const positions = [
        { row: 0, column: 0 },
        { row: 3, column: 5 },
        { row: 8, column: 8 },
      ];
      
      positions.forEach(pos => {
        const checkValueGameDto: CheckValueGameDto = {
          row: pos.row,
          column: pos.column,
          value: 5,
          gameId: '550e8400-e29b-41d4-a716-446655440000',
        };
        const expectedResult = { isCorrect: true };
        mockGameService.checkValue.mockReturnValue(expectedResult);

        const result = controller.checkValue(checkValueGameDto);

        expect(service.checkValue).toHaveBeenCalledWith(checkValueGameDto);
        expect(result).toEqual(expectedResult);
      });
    });

    it('should handle different values', () => {
      // Test various values
      const values = [1, 5, 9];
      
      values.forEach(value => {
        const checkValueGameDto: CheckValueGameDto = {
          row: 4,
          column: 4,
          value: value,
          gameId: '550e8400-e29b-41d4-a716-446655440000',
        };
        const expectedResult = { isCorrect: value % 2 === 0 }; // Just an example logic
        mockGameService.checkValue.mockReturnValue(expectedResult);

        const result = controller.checkValue(checkValueGameDto);

        expect(service.checkValue).toHaveBeenCalledWith(checkValueGameDto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('checkHintLimitAndReturnValue', () => {
    it('should call gameService.checkHintLimitAndReturnValue with the correct parameters', () => {
      // Arrange
      const checkGameInformationDto: CheckGameInformationDto = {
        gameId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const expectedResult = { hint: 5, hintsRemaining: 2 };
      mockGameService.checkHintLimitAndReturnValue.mockReturnValue(expectedResult);

      // Act
      const result = controller.checkHintLimitAndReturnValue(checkGameInformationDto);

      // Assert
      expect(service.checkHintLimitAndReturnValue).toHaveBeenCalledWith(checkGameInformationDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle different game IDs', () => {
      const gameIds = [
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
      ];
      
      gameIds.forEach(gameId => {
        const checkGameInformationDto: CheckGameInformationDto = {
          gameId,
        };
        const expectedResult = { hint: 5, hintsRemaining: 2 };
        mockGameService.checkHintLimitAndReturnValue.mockReturnValue(expectedResult);

        const result = controller.checkHintLimitAndReturnValue(checkGameInformationDto);

        expect(service.checkHintLimitAndReturnValue).toHaveBeenCalledWith(checkGameInformationDto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe('getScore', () => {
    it('should call gameService.getScore with the correct parameters', () => {
      // Arrange
      const getScoreDto: CheckGameInformationDto = {
        gameId: '550e8400-e29b-41d4-a716-446655440000',
      };
      const expectedResult = { score: 850, timeElapsed: '00:05:32' };
      mockGameService.getScore.mockReturnValue(expectedResult);

      // Act
      const result = controller.getScore(getScoreDto);

      // Assert
      expect(service.getScore).toHaveBeenCalledWith(getScoreDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle different game IDs', () => {
      const gameIds = [
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
      ];
      
      gameIds.forEach(gameId => {
        const getScoreDto: CheckGameInformationDto = {
          gameId,
        };
        const expectedResult = { score: 850, timeElapsed: '00:05:32' };
        mockGameService.getScore.mockReturnValue(expectedResult);

        const result = controller.getScore(getScoreDto);

        expect(service.getScore).toHaveBeenCalledWith(getScoreDto);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});