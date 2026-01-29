import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Governorate } from './governorate.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Governorate, (gov) => gov.cities, {
    onDelete: 'CASCADE',
  })
  governorate: Governorate;
}
