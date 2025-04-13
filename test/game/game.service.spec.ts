import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from '../../src/modules/game/game.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../../src/modules/game/entities/game.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateGameDto } from '../../src/modules/game/dto/create-game.dto';
import { CheckValueGameDto } from '../../src/modules/game/dto/check-score-game.dto';
import { CheckGameInformationDto } from '../../src/modules/game/dto/check-game-information.dto';

describe('GameService', () => {
    let service: GameService;
    let gameRepository: Repository<Game>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameService,
                {
                    provide: getRepositoryToken(Game),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<GameService>(GameService);
        gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new game and return its details', async () => {
            const createGameDto: CreateGameDto = {
                gridDimension: 9,
                difficulty: 'medium',
            };

            const mockGame = {
                id: 1,
                grid: [],
                currentGrid: [],
                hintsUsed: 0,
                errors: 0,
                corrects: 0,
                difficulty: 'medium',
                startedAt: new Date(),
                visibleValuesCount: 30,
            };

            jest.spyOn(gameRepository, 'create').mockReturnValue(mockGame as any);
            jest.spyOn(gameRepository, 'save').mockResolvedValue(mockGame as any);

            const result = await service.create(createGameDto);

            expect(result).toEqual({
                gameId: mockGame.id,
                hiddenGrid: mockGame.currentGrid,
                visibleCount: mockGame.visibleValuesCount,
            });
        });
    });

    describe('checkValue', () => {
        it('should return correct=true if the value matches the solution', async () => {
            const checkValueGameDto: CheckValueGameDto = {
                gameId: "1",
                row: 0,
                column: 0,
                value: 5,
            };

            const mockGame = {
                id: 1,
                grid: [[5]],
                currentGrid: [[0]],
                visibleValuesCount: 0,
                corrects: 0,
                errors: 0,
            };

            jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(mockGame as any);
            jest.spyOn(gameRepository, 'save').mockResolvedValue(mockGame as any);

            const result = await service.checkValue(checkValueGameDto);

            expect(result).toEqual({
                correct: true,
                visibleValuesCount: 1,
                errors: 0,
                correctCount: 1,
            });
        });

        it('should throw NotFoundException if the game is not found', async () => {
            const checkValueGameDto: CheckValueGameDto = {
                gameId: "1",
                row: 0,
                column: 0,
                value: 5,
            };

            jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(null);

            await expect(service.checkValue(checkValueGameDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('checkHintLimitAndReturnValue', () => {
        it('should return an error if maximum hints are used', async () => {
            const checkGameInformationDto: CheckGameInformationDto = { gameId: "1" };

            const mockGame = {
                id: 1,
                hintsUsed: 10,
                visibleValuesCount: 30,
            };

            jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(mockGame as any);

            const result = await service.checkHintLimitAndReturnValue(checkGameInformationDto);

            expect(result).toEqual({
                error: 'Maximum hints used',
                hintsUsed: 10,
                maxHints: 10,
            });
        });
    });

    describe('getScore', () => {
        it('should calculate and return the total score', async () => {
            const checkGameInformationDto: CheckGameInformationDto = { gameId: "1" };

            const mockGame = {
                id: 1,
                corrects: 10,
                errors: 2,
                hintsUsed: 3,
                startedAt: new Date(Date.now() - 5000),
            };

            jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(mockGame as any);

            const result = await service.getScore(checkGameInformationDto);

            expect(result).toBeGreaterThan(0);
        });
    });

    describe('isGameCompleted', () => {
        it('should return true if the game is completed', async () => {
            const checkGameInformationDto: CheckGameInformationDto = { gameId: "1" };

            const mockGame = {
                id: 1,
                currentGrid: [[1]],
                grid: [[1]],
            };

            jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(mockGame as any);

            const result = await service.isGameCompleted(checkGameInformationDto);

            expect(result).toBe(true);
        });

        it('should return false if the game is not completed', async () => {
            const checkGameInformationDto: CheckGameInformationDto = { gameId: "1" };

            const mockGame = {
                id: 1,
                currentGrid: [[0]],
                grid: [[1]],
            };

            jest.spyOn(gameRepository, 'findOneBy').mockResolvedValue(mockGame as any);

            const result = await service.isGameCompleted(checkGameInformationDto);

            expect(result).toBe(false);
        });
    });
});