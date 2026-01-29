// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                (req: Request) => {
                    // Try to get token from cookies first
                    return req?.cookies?.accessToken || null;
                },

            ]),
            secretOrKey: 'SECRET_KEY',
            ignoreExpiration: false,
        });
    }
    async validate(payload: any) {
        console.log('AccessTokenStrategy - validate payload:', payload);
        return payload;
    }
}