import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/user.entity';
import { Address } from '../../addresses/entites/address.entity';
import { JoinColumn as JoinColumnAddress, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => User, { onDelete: 'CASCADE', cascade: ['remove', 'soft-remove'] })
  @JoinColumn()
  user: User;

  @Exclude()
  @OneToMany(() => Address, (address) => address.customer, {
    cascade: true,
  })
  addresses: Address[];


  @Exclude()
  @ManyToOne(() => Address, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  selectedDeliveryAddress: Address;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;
}
