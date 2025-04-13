import { Test, TestingModule } from '@nestjs/testing';
import { LeaderboardService } from '../../src/modules/leaderboard/leaderboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from '../../src/modules/leaderboard/entities/record.entity';
import { RecordDto } from '../../src/modules/leaderboard/dto/record.dto';

describe('LeaderboardService', () => {
    let service: LeaderboardService;
    let recordRepository: Repository<Record>;

    const mockRecordRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LeaderboardService,
                {
                    provide: getRepositoryToken(Record),
                    useValue: mockRecordRepository,
                },
            ],
        }).compile();

        service = module.get<LeaderboardService>(LeaderboardService);
        recordRepository = module.get<Repository<Record>>(getRepositoryToken(Record));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addRecord', () => {
        it('should create and save a new record', async () => {
            const recordDto: RecordDto = {
                username: 'test_user',
                score: 100,
                difficulty: 'beginner',
            };
            const createdRecord = { ...recordDto, completedAt: new Date() };

            mockRecordRepository.create.mockReturnValue(createdRecord);
            mockRecordRepository.save.mockResolvedValue(createdRecord);

            const result = await service.addRecord(recordDto);

            expect(mockRecordRepository.create).toHaveBeenCalledWith({
                username: recordDto.username,
                score: recordDto.score,
                difficulty: recordDto.difficulty,
                completedAt: expect.any(Date),
            });
            expect(mockRecordRepository.save).toHaveBeenCalledWith(createdRecord);
            expect(result).toEqual(createdRecord);
        });

        it('should log an error if saving fails', async () => {
            const recordDto: RecordDto = {
                username: 'test_user',
                score: 100,
                difficulty: 'beginner',
            };

            mockRecordRepository.create.mockReturnValue(recordDto);
            mockRecordRepository.save.mockRejectedValue(new Error('Save failed'));

            const result = await service.addRecord(recordDto);

            expect(result).toEqual(recordDto);
        });
    });

    describe('removeRecord', () => {
        it('should remove a record by ID', async () => {
            mockRecordRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.removeRecord('123');

            expect(mockRecordRepository.delete).toHaveBeenCalledWith('123');
            expect(result).toBe('Record with ID 123 removed successfully');
        });

        it('should return a message if no record is found', async () => {
            mockRecordRepository.delete.mockResolvedValue({ affected: 0 });

            const result = await service.removeRecord('123');

            expect(mockRecordRepository.delete).toHaveBeenCalledWith('123');
            expect(result).toBe('No record found with ID 123');
        });
    });

    describe('getTopRecordsByDifficulty', () => {
        it('should return top 3 records for a given difficulty', async () => {
            const mockRecords = [
                { username: 'user1', score: 100, difficulty: 'beginner' },
                { username: 'user2', score: 90, difficulty: 'beginner' },
                { username: 'user3', score: 80, difficulty: 'beginner' },
            ];

            mockRecordRepository.find.mockResolvedValue(mockRecords);

            const result = await service.getTopRecordsByDifficulty('beginner');

            expect(mockRecordRepository.find).toHaveBeenCalledWith({
                where: { difficulty: 'beginner' },
                order: { score: 'DESC' },
                take: 3,
            });
            expect(result).toEqual(mockRecords);
        });

        it('should log a warning if finding records fails', async () => {
            mockRecordRepository.find.mockRejectedValue(new Error('Find failed'));

            const result = await service.getTopRecordsByDifficulty('beginner');

            expect(result).toEqual([]);
        });
    });
});