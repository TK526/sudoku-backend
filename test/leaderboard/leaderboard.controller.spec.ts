import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardController } from '../../src/modules/leaderboard/leaderboard.controller';
import { LeaderboardService } from '../../src/modules/leaderboard/leaderboard.service';
import { RecordDto } from '../../src/modules/leaderboard/dto/record.dto';

describe('LeaderboardController', () => {
  let controller: LeaderboardController;
  let service: LeaderboardService;

  // Mock service implementation
  const mockLeaderboardService = {
    getTopRecords: jest.fn(),
    removeRecord: jest.fn(),
    addRecord: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardController],
      providers: [
        {
          provide: LeaderboardService,
          useValue: mockLeaderboardService,
        },
      ],
    }).compile();

    controller = module.get<LeaderboardController>(LeaderboardController);
    service = module.get<LeaderboardService>(LeaderboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTopRecords', () => {
    it('should call leaderboardService.getTopRecords', () => {
      // Arrange
      const expectedResult = [
        { id: '1', username: 'user1', score: 950, difficulty: 'expert' },
        { id: '2', username: 'user2', score: 800, difficulty: 'hard' },
        { id: '3', username: 'user3', score: 750, difficulty: 'intermediate' },
      ];
      mockLeaderboardService.getTopRecords.mockReturnValue(expectedResult);

      // Act
      const result = controller.getTopRecords();

      // Assert
      expect(service.getTopRecords).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty leaderboard', () => {
      // Arrange
      const expectedResult = [];
      mockLeaderboardService.getTopRecords.mockReturnValue(expectedResult);

      // Act
      const result = controller.getTopRecords();

      // Assert
      expect(service.getTopRecords).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeRecord', () => {
    it('should call leaderboardService.removeRecord with the correct id', () => {
      // Arrange
      const recordId = '550e8400-e29b-41d4-a716-446655440000';
      const expectedResult = { id: recordId, deleted: true };
      mockLeaderboardService.removeRecord.mockReturnValue(expectedResult);

      // Act
      const result = controller.removeRecord(recordId);

      // Assert
      expect(service.removeRecord).toHaveBeenCalledWith(recordId);
      expect(result).toEqual(expectedResult);
    });

    it('should handle different record IDs', () => {
      const recordIds = [
        '550e8400-e29b-41d4-a716-446655440000',
        '550e8400-e29b-41d4-a716-446655440001',
        '550e8400-e29b-41d4-a716-446655440002',
      ];
      
      recordIds.forEach(recordId => {
        const expectedResult = { id: recordId, deleted: true };
        mockLeaderboardService.removeRecord.mockReturnValue(expectedResult);

        const result = controller.removeRecord(recordId);

        expect(service.removeRecord).toHaveBeenCalledWith(recordId);
        expect(result).toEqual(expectedResult);
      });
    });

    it('should handle non-existent record IDs', () => {
      // Arrange
      const nonExistentId = 'non-existent-id';
      const expectedResult = { id: nonExistentId, deleted: false };
      mockLeaderboardService.removeRecord.mockReturnValue(expectedResult);

      // Act
      const result = controller.removeRecord(nonExistentId);

      // Assert
      expect(service.removeRecord).toHaveBeenCalledWith(nonExistentId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addRecord', () => {
    it('should call leaderboardService.addRecord with the correct record', () => {
      // Arrange
      const recordDto: RecordDto = {
        username: 'testUser',
        score: 750,
        difficulty: 'hard',
      };
      const expectedResult = { 
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...recordDto,
        timestamp: expect.any(Date)
      };
      mockLeaderboardService.addRecord.mockReturnValue(expectedResult);

      // Act
      const result = controller.addRecord(recordDto);

      // Assert
      expect(service.addRecord).toHaveBeenCalledWith(recordDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle records with different difficulties', () => {
      const difficulties = ['beginner', 'intermediate', 'hard', 'expert'];
      
      difficulties.forEach(difficulty => {
        const recordDto: RecordDto = {
          username: 'testUser',
          score: 750,
          difficulty,
        };
        const expectedResult = { 
          id: '550e8400-e29b-41d4-a716-446655440000',
          ...recordDto,
          timestamp: expect.any(Date)
        };
        mockLeaderboardService.addRecord.mockReturnValue(expectedResult);

        const result = controller.addRecord(recordDto);

        expect(service.addRecord).toHaveBeenCalledWith(recordDto);
        expect(result).toEqual(expectedResult);
      });
    });

    it('should handle records with different scores', () => {
      const scores = [100, 500, 1000, 5000, 9999];
      
      scores.forEach(score => {
        const recordDto: RecordDto = {
          username: 'testUser',
          score,
          difficulty: 'hard',
        };
        const expectedResult = { 
          id: '550e8400-e29b-41d4-a716-446655440000',
          ...recordDto,
          timestamp: expect.any(Date)
        };
        mockLeaderboardService.addRecord.mockReturnValue(expectedResult);

        const result = controller.addRecord(recordDto);

        expect(service.addRecord).toHaveBeenCalledWith(recordDto);
        expect(result).toEqual(expectedResult);
      });
    });

    it('should handle records with different usernames', () => {
      const usernames = ['player1', 'championGamer', 'sudokuMaster', 'user123'];
      
      usernames.forEach(username => {
        const recordDto: RecordDto = {
          username,
          score: 750,
          difficulty: 'hard',
        };
        const expectedResult = { 
          id: '550e8400-e29b-41d4-a716-446655440000',
          ...recordDto,
          timestamp: expect.any(Date)
        };
        mockLeaderboardService.addRecord.mockReturnValue(expectedResult);

        const result = controller.addRecord(recordDto);

        expect(service.addRecord).toHaveBeenCalledWith(recordDto);
        expect(result).toEqual(expectedResult);
      });
    });
  });
});