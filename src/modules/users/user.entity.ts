import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['email'])
export default class User {
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
    phoneNumber: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    password: string;

    @CreateDateColumn()
    createDate: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
