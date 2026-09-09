import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';

@Entity('films')
export class FilmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'double precision' })
  rating!: number;

  @Column({ type: 'varchar' })
  director!: string;

  @Column({
    type: 'text',
    transformer: {
      to: (value?: string[]) => (value ?? []).join(','),
      from: (value: string | null) =>
        value ? value.split(',').filter(Boolean) : [],
    },
  })
  tags!: string[];

  @Column({ type: 'varchar' })
  image!: string;

  @Column({ type: 'varchar' })
  cover!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  about!: string;

  @Column({ type: 'varchar' })
  description!: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film)
  schedule!: ScheduleEntity[];
}
