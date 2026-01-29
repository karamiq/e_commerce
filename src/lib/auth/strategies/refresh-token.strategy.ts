import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRefreshToken } from '../users-tokens.entity';
import { Repository } from 'typeorm';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        @InjectRepository(UserRefreshToken)
        private readonly userRefreshTokenRepository: Repository<UserRefreshToken>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([

                (req: Request) => {
                    // Try to get token from cookie
                    return req?.cookies?.refreshToken || null;
                },

            ]),
            secretOrKey: 'RT_SECRET_KEY',
            passReqToCallback: true,
        });
    }

    // validate(req: Request, payload: any) {
    //     return payload;  // ✅ Returning the decoded JWT payload
    // }
    // validate(req: Request) {
    //     return req;  // ❌ Returning the entire request object
    // }
    async validate(req: Request, payload: any) {
        // When passReqToCallback is true, the first parameter is the request
        // and the second parameter is the decoded JWT payload
        // Return the payload so it gets attached to request.user

        return payload;
    }
}