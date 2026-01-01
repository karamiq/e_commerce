import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from '../../users/user.entity';
import { Roles } from '../../roles/entities/roles.entity';


@Entity()
export default class Employees {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Roles, {
    eager: true,
  })
  role: Roles;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}