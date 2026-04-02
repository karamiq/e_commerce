import { BadRequestException, Body, Controller, Delete, Get, Post, Req, Res, SerializeOptions, UseGuards } from '@nestjs/common';
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
        const { accessToken, refreshToken } = await this.authService.customerSignin(signinDto);
        res.cookie('accessToken', accessToken, {
            httpOnly: false,
            sameSite: 'lax',
            secure: false,
            maxAge: 15 * 60 * 1000, // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: false,
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return { accessToken, refreshToken };
    }


    @Post('access-token')
    @Public()
    // @UseGuards(RefreshTokenGuard)
    @ApiBearerAuth('refresh-token')
    @ApiOperation({ summary: 'Get access token using refresh token' })
    @ApiOkResponse({ description: 'The access token has been successfully generated.' })
    @ApiBadRequestResponse({ description: 'Invalid refresh token supplied.' })
    @ApiBody({
        // se the body
        schema: {
            type: 'object',
            properties: {
                refreshToken: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGVJZCI6MSwiaWF0IjoxNjg4ODQyODAwLCJleHAiOjE2ODg4NDY0MDB9.abc123',
                },
            },
            required: ['refreshToken'],
        },
    })
    async refreshToken(@Body() body: { refreshToken: string }, @Res({ passthrough: true }) res: Response) {
        if (!body || typeof body.refreshToken !== 'string' || !body.refreshToken) {
            throw new BadRequestException('refreshToken is required in the request body');
        }

        const { refreshToken } = body;
        console.log('AuthController - refreshToken called with refreshToken:', refreshToken);
        const activeUser = await this.authService.validateRefreshToken(refreshToken);
        if (!activeUser) {
            throw new BadRequestException('Invalid refresh token');
        }
        const decodedToken = await this.authService.decodeRefreshToken(refreshToken);
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
        const tokenResult = await this.authService.generateAccessToken(finalResponse);
        const accessTokenString = tokenResult.accessToken || tokenResult;
        res.cookie('accessToken', accessTokenString, {
            httpOnly: true,
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        return { accessToken: accessTokenString };
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

    @Post('logout')
    @ApiOperation({ summary: 'Logout user and clear auth cookies' })
    @ApiOkResponse({ description: 'User has been logged out.' })
    async logout(@Res({ passthrough: true }) res: Response, @ActiveUser() activeUser: ActiveUserData) {
        // Clear cookies
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'lax' });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
        // Optionally: revoke refresh token in DB here

        return 'User has been logged out successfully.';

    }
}
