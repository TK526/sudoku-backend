import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from '../game/game.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GameModule,
    LeaderboardModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'sudoku',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
