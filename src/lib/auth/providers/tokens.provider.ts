import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ActiveUserData from '../interfaces/active-user-data.interface';

@Injectable()
export class TokensProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken<T>(userId: string, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.secret'),
        expiresIn: this.configService.getOrThrow<number>('jwt.accessTokenTtl'),
        audience: this.configService.get<string>('jwt.audience'),
        issuer: this.configService.get<string>('jwt.issuer'),
      },
    );
  }

  async generateRefreshToken<T>(userId: string, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow<number>('jwt.refreshTokenTtl'),
        audience: this.configService.get<string>('jwt.audience'),
        issuer: this.configService.get<string>('jwt.issuer'),
      },
    );
  }

  async decodeRefreshToken(token: string): Promise<ActiveUserData> {
    return await this.jwtService.decode(token);
  }
}
