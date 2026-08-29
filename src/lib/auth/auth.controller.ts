import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/signin.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { Public } from './decorators/public.decorator';
import { ActiveUser } from './decorators/active-user.decorator';
import type ActiveUserData from './interfaces/active-user-data.interface';
import { Repository } from 'typeorm';
import { UserRefreshToken } from './users-tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserRefreshToken)
    private userRefreshTokenRepository: Repository<UserRefreshToken>,
  ) {}

  @Post('employee/signin')
  @Public()
  async employeeSignin(
    @Body() signinDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.employeeSignin(signinDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return { accessToken, refreshToken };
  }

  @Post('customer/signin')
  @Public()
  async customerSignin(
    @Body() signinDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.customerSignin(signinDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: false,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accessToken, refreshToken };
  }

  @Post('access-token')
  @Public()
  async refreshToken(
    @Body() body: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!body || typeof body.refreshToken !== 'string' || !body.refreshToken) {
      throw new BadRequestException(
        'refreshToken is required in the request body',
      );
    }

    const { refreshToken } = body;
    const activeUser =
      await this.authService.validateRefreshToken(refreshToken);
    if (!activeUser) {
      throw new BadRequestException('Invalid refresh token');
    }
    const decodedToken =
      await this.authService.decodeRefreshToken(refreshToken);
    const expiresAt = new Date(decodedToken.exp * 1000);
    if (expiresAt < new Date()) {
      throw new BadRequestException('Refresh token has expired');
    }

    const finalResponse: ActiveUserData = {
      sub: decodedToken.sub,
      roleId: decodedToken.roleId,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
    const tokenResult =
      await this.authService.generateAccessToken(finalResponse);
    const accessTokenString = tokenResult.accessToken || tokenResult;
    res.cookie('accessToken', accessTokenString, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return { accessToken: accessTokenString };
  }

  @Get('all-refresh-tokens')
  @Public()
  async getAllRefreshTokens() {
    return this.authService.getAllRefreshTokens();
  }

  @Delete('remove-refresh-token')
  @Public()
  async removeRefreshToken() {
    const refreshTokens = await this.userRefreshTokenRepository.find();
    for (const refreshToken of refreshTokens) {
      await this.userRefreshTokenRepository.remove(refreshToken);
    }
    return { message: 'All refresh tokens have been successfully removed.' };
  }

  @Get('me')
  @UseGuards(RefreshTokenGuard)
  async getMe(@ActiveUser() activeUser: ActiveUserData) {
    return activeUser;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax' });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
    return 'User has been logged out successfully.';
  }
}
