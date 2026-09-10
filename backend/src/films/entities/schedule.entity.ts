import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  daytime!: string;

  @Column({ type: 'int' })
  hall!: number;

  @Column({ type: 'int' })
  rows!: number;

  @Column({ type: 'int' })
  seats!: number;

  @Column({ type: 'double precision' })
  price!: number;

  @Column({
    type: 'text',
    array: true,
  })
  taken!: string[];

  @ManyToOne(() => FilmEntity, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film!: FilmEntity;
}
