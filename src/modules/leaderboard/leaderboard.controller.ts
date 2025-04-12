import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { RecordDto } from './dto/record.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getTopRecords() {
    return this.leaderboardService.getTopRecords();
  }

  @Delete(':id')
  removeRecord(@Param('id') id: string) {
    return this.leaderboardService.removeRecord(id);
  }

  @Post()
  addRecord(@Body() record: RecordDto) {
    return this.leaderboardService.addRecord(record);
  }
}