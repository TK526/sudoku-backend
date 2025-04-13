import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';
import { RecordDto } from './dto/record.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Record) 
    private readonly recordRepository: Repository<Record>,
  ) {}

  async addRecord(record: RecordDto) {
    const newRecord = this.recordRepository.create({
      username: record.username,
      score: record.score,
      difficulty: record.difficulty,
      completedAt: new Date(),
    });
    
    // Add a new record to the database
    try {
      await this.recordRepository.save(newRecord);
    } catch (err) {
      Logger.error(`Could not addRecord for record: ${JSON.stringify(record)}, with error: ${err}`, LeaderboardService.name);
    }
    return newRecord;
  }

  // Retrieve top records from the database
  async getTopRecords() {
    // Get top 3 records for 'beginner' difficulty
    const topRecordsBeginner = await this.getTopRecordsByDifficulty('beginner');
  
    // Get top 3 records for 'intermediate' difficulty
    const topRecordsIntermediate = await this.getTopRecordsByDifficulty('intermediate');

    // Get top 3 records for 'hard' difficulty
    const topRecordsHard = await this.getTopRecordsByDifficulty('hard');
  
    // Get top 3 records for 'expert' difficulty
    const topRecordsExpert = await this.getTopRecordsByDifficulty('expert');
  
    return {
      beginner: topRecordsBeginner,
      intermediate: topRecordsIntermediate,
      hard: topRecordsHard,
      expert: topRecordsExpert,
    };
  }
  

  // Remove a record by ID
  async removeRecord(recordId: string) {
    const result = await this.recordRepository.delete(recordId);
    if (result.affected === 0) {
      return `No record found with ID ${recordId}`;
    }
    return `Record with ID ${recordId} removed successfully`;
  }

  //helper function to get top 3 records based on difficulty
  async getTopRecordsByDifficulty(difficulty: string) {
    let records: Record[] = [];
    try {
      records = await this.recordRepository.find({
        where: {
          difficulty: difficulty,
        },
        order: {
          score: 'DESC', // Order by score in descending order
        },
        take: 3, // Limit to top 3 records
      });
    } catch (err) {
      Logger.warn(`Could not find getTopRecordsByDifficulty for difficulty: ${difficulty}, with error: ${err}`, LeaderboardService.name);
    }

    return records;
  }
}
