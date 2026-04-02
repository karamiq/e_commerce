import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import Employees from '../employees/entities/employees.entity';

@Entity('users')
@Unique(['email'])
export default class User {
    @OneToOne(() => Employees, (employee) => employee.user, {
        cascade: ['remove', 'soft-remove'],
        onDelete: 'CASCADE',
        nullable: true,
    })
    employee: Employees;
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    firstName: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    lastName: string;

    @Column({
        unique: true,
        type: 'varchar',
        length: 100,
        nullable: false
    })
    email: string;
    @Column({
        type: 'varchar',
        length: 16,
        nullable: false
    })
    @Column(
        {
            type: 'varchar', length: 255, nullable: true

        }
    )
    profileImageUrl: string;

    @Column({
        type: 'varchar',
        length: 20,
        nullable: true
    })
    phoneNumber: string;
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    password: string;

    @CreateDateColumn()
    createAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
