import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "../users/user.entity";


@Entity('user_refresh_tokens')
export class UserRefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar', nullable: false })
    refreshToken: string;

    @OneToOne(() => User, {
        eager: true,
        nullable: false,
        onDelete: 'CASCADE',  // if the user is deleted, the refresh token is deleted
    })
    @JoinColumn()
    user: User;

    @Column({ type: 'timestamp', nullable: false })
    expiresAt: Date;

    @Column({ type: 'timestamp', nullable: false })
    createdAt: Date;

    @Column({ type: 'boolean', default: false, nullable: false })
    isRevoked: boolean;

}