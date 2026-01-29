import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/user.entity';
import { Address } from '../../addresses/entites/address.entity';
import { JoinColumn as JoinColumnAddress, ManyToOne } from 'typeorm';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => User, { onDelete: 'CASCADE', eager: true, cascade: ['remove', 'soft-remove'] })
  @JoinColumn()
  user: User;

  @OneToMany(() => Address, (address) => address.customer, {
    cascade: true,
  })
  addresses: Address[];

  @ManyToOne(() => Address, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  selectedDeliveryAddress: Address;
}