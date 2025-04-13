import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Can not store number[][] naturally on mySQL - mySQl supports scalar types + single arrays as JSON or text basically
// Need to use jsonTransformer and parse to/from text
const jsonTransformer = {
  to: (value: number[][]): string => JSON.stringify(value),
  from: (value: string): number[][] => JSON.parse(value),
};

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', transformer: jsonTransformer })
  grid: number[][];

  @Column({ type: 'text', transformer: jsonTransformer })
  currentGrid: number[][];

  @Column()
  visibleValuesCount: number;

  @Column()
  errors: number;

  @Column()
  corrects: number;

  @Column()
  hintsUsed: number;

  @Column()
  difficulty: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;
}
