import { Roles } from 'src/modules/roles/entities/roles.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, DeleteDateColumn } from 'typeorm';


@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, update: false })
  name: string; // e.g., 'product:create'

  @Column({ nullable: true })
  description: string; // e.g., 'Allows creating a new product'

  @ManyToMany(() => Roles, (role) => role.permissions)
  roles: Roles[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}