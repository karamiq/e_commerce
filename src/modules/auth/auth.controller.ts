import { Body, Controller, Delete, Get, Post, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
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
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './guards/access-token.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        @InjectRepository(UserRefreshToken)
        private userRefreshTokenRepository: Repository<UserRefreshToken>,
    ) { }
    // @Post('signup')
    // @ApiOperation({ summary: 'Register a new user account' })
    // @ApiBody({ type: SignupDto })
    // @ApiCreatedResponse({
    //     description: 'The user has been successfully registered.',
    //     type: User,
    // })
    // @Public()
    // @ApiBadRequestResponse({ description: 'Invalid signup payload supplied.' })
    // async signup(@Body() signupDto: SignupDto) {
    //     return this.authService.signup(signupDto);
    // }

    @Post('employee/signin')
    @Public()
    @ApiOperation({ summary: 'Authenticate an employee' })
    @ApiBody({ type: SignInDto })
    @ApiOkResponse({ description: 'The employee has been successfully authenticated.' })
    @ApiBadRequestResponse({ description: 'Invalid employee credentials supplied.' })
    async employeeSignin(@Body() signinDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.employeeSignin(signinDto);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        return { accessToken, refreshToken };
    }

    @Post('customer/signin')
    @Public()
    @ApiOperation({ summary: 'Authenticate a customer' })
    @ApiBody({ type: SignInDto })
    @ApiOkResponse({ description: 'The customer has been successfully authenticated.' })
    @ApiBadRequestResponse({ description: 'Invalid customer credentials supplied.' })
    async customerSignin(@Body() signinDto: SignInDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken, user } = await this.authService.customerSignin(signinDto);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        return { accessToken, refreshToken, user };
    }

    @Post('access-token')
    @Public()
    @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth('refresh-token')
    @ApiOperation({ summary: 'Get access token using refresh token' })
    @ApiOkResponse({ description: 'The access token has been successfully generated.' })
    @ApiBadRequestResponse({ description: 'Invalid refresh token supplied.' })
    async refreshToken(@ActiveUser() activeUser: ActiveUserData, @Res({ passthrough: true }) res: Response) {
        const accessToken = await this.authService.generateAccessToken(activeUser);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        return accessToken;
    }

    @Get('all-refresh-tokens')
    @Public()
    @ApiOperation({ summary: 'Get all refresh tokens' })
    @ApiOkResponse({ description: 'The list of refresh tokens has been successfully retrieved.' })
    @ApiBadRequestResponse({ description: 'Invalid refresh token supplied.' })
    async getAllRefreshTokens() {
        return this.authService.getAllRefreshTokens();
    }

    @Delete('remove-refresh-token')
    @Public()
    @ApiOperation({ summary: 'Remove a refresh token' })
    @ApiOkResponse({ description: 'The refresh token has been successfully removed.' })
    @ApiBadRequestResponse({ description: 'Invalid refresh token supplied.' })
    async removeRefreshToken() {
        const refreshTokens = await this.userRefreshTokenRepository.find();
        for (const refreshToken of refreshTokens) {
            await this.userRefreshTokenRepository.remove(refreshToken);
        }
        return { message: 'All refresh tokens have been successfully removed.' };
    }
    @Get('me')
    @UseGuards(RefreshTokenGuard)
    @ApiOperation({ summary: 'Get current authenticated user info' })
    @ApiOkResponse({ description: 'The current authenticated user info has been successfully retrieved.' })
    async getMe(@ActiveUser() activeUser: ActiveUserData) {
        console.log('AuthController - getMe called for user:', activeUser);
        return activeUser;
    }

    @Post('')
    @ApiOperation({ summary: 'Logout user and clear auth cookies' })
    @ApiOkResponse({ description: 'User has been logged out.' })
    async logout(@Res({ passthrough: true }) res: Response) {
        // Clear cookies
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax' });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
        // Optionally: revoke refresh token in DB here
        return { message: 'Logged out successfully' };
    }
}