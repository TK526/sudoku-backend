import { Controller, Get, Post, Body, Param, Delete, Logger } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { RecordDto } from './dto/record.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  getTopRecords() {
    Logger.debug(`Entering getTopRecords endpoint`, LeaderboardController.name);
    return this.leaderboardService.getTopRecords();
  }

  @Delete(':id')
  removeRecord(@Param('id') id: string) {
    Logger.debug(`Entering removeRecord endpoint, with param id: ${id}`, LeaderboardController.name);
    return this.leaderboardService.removeRecord(id);
  }

  @Post()
  addRecord(@Body() record: RecordDto) {
    Logger.debug(`Entering addRecord endpoint, with body ${JSON.stringify(record)}`, LeaderboardController.name);
    return this.leaderboardService.addRecord(record);
  }
}