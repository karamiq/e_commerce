import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ActiveUserData from '../interfaces/active-user-data.interface';

@Injectable()
export class TokensProvider {
    constructor(private readonly jwtService: JwtService) { }

    async generateAccessToken<T>(userId: string, payload?: T) {
        return this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            secret: 'SECRET_KEY',
            expiresIn: '15m',
        });
    }

    async generateRefreshToken<T>(userId: string, payload?: T) {
        return this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            secret: 'RT_SECRET_KEY',
            expiresIn: '7d',
        });
    }

    async decodeRefreshToken(token: string): Promise<ActiveUserData> {
        return await this.jwtService.decode(token);
    }
}