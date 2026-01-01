import { ExecutionContext, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { request, Request } from 'express';
import { Repository } from 'typeorm';
import { UserRefreshToken } from '../users-tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ActiveUserData from '../interfaces/active-user-data.interface';
import { TokensProvider } from '../providers/tokens.provider';
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    constructor(
        @InjectRepository(UserRefreshToken)
        private readonly userRefreshTokenRepository: Repository<UserRefreshToken>,
        private readonly tokensProvider: TokensProvider,
    ) {
        super();
    }
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            this.removeRefreshToken(context);
            throw err || new UnauthorizedException('Invalid or expired refresh token');
        }
        return user;
    }
    private async removeRefreshToken(context: ExecutionContext) {
        try {
            const request = context.switchToHttp().getRequest();
            const decodedToken = await this.tokensProvider.decodeRefreshToken(request.headers['authorization']?.split(' ')[1]);
            const refreshTokenEntity = await this.userRefreshTokenRepository.findOne({ where: { user: { id: decodedToken.sub } } });
            console.log('has the refresh token expired? ', refreshTokenEntity && refreshTokenEntity.expiresAt < new Date());
            if (refreshTokenEntity && refreshTokenEntity.expiresAt < new Date()) {
                this.userRefreshTokenRepository.remove(refreshTokenEntity);
            }
        } catch (error) { }
    }
}