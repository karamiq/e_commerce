import { Permissions } from "src/lib/permissions/entities/permissions.entity";
import User from "src/lib/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
    type: 'varchar',
    length: 100
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ManyToMany(() => Permissions, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable() // This creates the Join Table in DB
  permissions: Permissions[];

  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
