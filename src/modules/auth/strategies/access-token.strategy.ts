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
                (req: Request) => {
                    // Try to get token from cookie
                    return req?.cookies?.accessToken || null;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: 'SECRET_KEY',
            ignoreExpiration: false,
        });
    }
    async validate(payload: any) {
        console.log('AccessTokenStrategy - validate called with payload:', payload);
        return payload;
    }
}