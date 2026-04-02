import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { TokensProvider } from './providers/tokens.provider';
import { HashingProvider } from './providers/hashing-provider';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRefreshToken } from './users-tokens.entity';
import { Repository } from 'typeorm';
import type ActiveUserData from './interfaces/active-user-data.interface';
import { EmployeesService } from '../employees/employees.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class AuthService {
    async decodeRefreshToken(refreshToken: string) {
        return this.tokensProvider.decodeRefreshToken(refreshToken);
    }
    async validateRefreshToken(refreshToken: string) {
        const tokenPayload = await this.tokensProvider.decodeRefreshToken(refreshToken);
        if (!tokenPayload) {
            return null;
        }
        const userId = tokenPayload.sub;
        const refreshTokens = await this.userRefreshTokenRepository.find({ where: { user: { id: userId } } });
        if (refreshTokens.length === 0) {
            return null;
        }
        return { id: userId };
    }

    constructor(private usersService: UsersService,
        private tokensProvider: TokensProvider,
        private hashingProvider: HashingProvider,
        private employeesService: EmployeesService,
        private customersService: CustomersService,

        @InjectRepository(UserRefreshToken)
        private userRefreshTokenRepository: Repository<UserRefreshToken>,
    ) { }
    // async signup(signupDto: SignupDto) {
    //     const user = await this.usersService.createUser(signupDto);
    //     const refreshToken = await this.tokensProvider.generateRefreshToken(user.id);
    //     return {
    //         refreshToken
    //     };
    // }

    async employeeSignin(signinDto: SignInDto) {
        // 1. Fetch employee with relations to get to permissions
        // Ensure your findByEmail inside EmployeesService uses: 
        // relations: ['user', 'role', 'role.permissions']
        const employee = await this.employeesService.findByEmail(signinDto.email);
        if (!employee) {
            throw new UnauthorizedException('Employee not found');
        }
        const isPasswordValid = await this.hashingProvider.compare(signinDto.password, employee.user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        const roleId = employee.role?.id;
        const permissions = employee.role?.permissions.map(p => p.name) || [];

        // Generate access token with permissions
        const accessToken = await this.tokensProvider.generateAccessToken(
            employee.user.id,
            {
                roleId: roleId,
                permissions: permissions,
            }
        );

        // Generate refresh token
        const refreshToken = await this.tokensProvider.generateRefreshToken(
            employee.user.id,
            {
                roleId: roleId,
            }
        );

        const tokenPayload = await this.tokensProvider.decodeRefreshToken(refreshToken);
        const expiresAt = new Date(tokenPayload.exp * 1000);
        const createdAt = new Date(tokenPayload.iat * 1000);

        await this.storeRefreshToken(employee, refreshToken, expiresAt, createdAt);

        return {
            accessToken,
            refreshToken,
        };
    }

    async customerSignin(signinDto: SignInDto) {
        // Find customer by email through the dedicated CustomersService
        const customer = await this.customersService.findByEmail(signinDto.email);
        if (!customer) {
            throw new UnauthorizedException('Customer not found');
        }

        const user = customer.user;
        const isPasswordValid = await this.hashingProvider.compare(signinDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        // Generate access token (no permissions for customers)
        const accessToken = await this.tokensProvider.generateAccessToken(user.id, {});

        // Generate refresh token
        const refreshToken = await this.tokensProvider.generateRefreshToken(user.id);
        const tokenPayload = await this.tokensProvider.decodeRefreshToken(refreshToken);
        const expiresAt = new Date(tokenPayload.exp * 1000);
        const createdAt = new Date(tokenPayload.iat * 1000);

        await this.storeRefreshToken(user, refreshToken, expiresAt, createdAt);
        return {
            accessToken,
            refreshToken,
        };
    }

    private async storeRefreshToken(entityWithUser: any, refreshToken: string, expiresAt: Date, createdAt: Date) {
        // Handle both employee (has .user property) and customer/user (is the user itself)
        const user = entityWithUser.user || entityWithUser;
        const storedToken = await this.userRefreshTokenRepository.findOneBy({ user: { id: user.id } });
        if (!storedToken) {
            const newToken: UserRefreshToken = this.userRefreshTokenRepository.create({
                user: user,
                refreshToken: refreshToken,
                expiresAt: expiresAt,
                createdAt: createdAt,
                isRevoked: false,
            });
            await this.userRefreshTokenRepository.save(newToken);
        } else {
            storedToken.refreshToken = refreshToken;
            storedToken.expiresAt = expiresAt;
            storedToken.createdAt = createdAt;
            storedToken.isRevoked = false;
            await this.userRefreshTokenRepository.save(storedToken);
        }
    }


    async generateAccessToken(activeUser: ActiveUserData) {
        // If roleId exists in token, it's an employee
        if (activeUser.roleId) {
            const employee = await this.employeesService.findByUserId(activeUser.sub);
            const accessToken = await this.tokensProvider.generateAccessToken(
                activeUser.sub, {
                roleId: activeUser.roleId,
                permissions: employee.role?.permissions.map(p => p.name) || [],
            });
            return {
                accessToken,
                payload: this.tokensProvider.decodeRefreshToken(accessToken),
            };
        }
        // Otherwise it's a customer with no permissions
        return {
            accessToken: await this.tokensProvider.generateAccessToken(
                activeUser.sub,
            ),
        };
    }
    getAllRefreshTokens() {
        return this.userRefreshTokenRepository.find();
    }
}