import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AccessTokenGuard } from './guards/access-token.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRefreshToken } from './users-tokens.entity';
import { HashingProvider } from './providers/hashing-provider';
import { BcryptHashingProvider } from './providers/bcrypt-provider';
import { TokensProvider } from './providers/tokens.provider';
import { EmployeesModule } from '../employees/employees.module';
import { CustomersModule } from '../customers/customers.module';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => EmployeesModule),
        forwardRef(() => CustomersModule),
        RolesModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
        }),
        TypeOrmModule.forFeature([UserRefreshToken]),

    ],

    providers: [
        AuthService,
        AccessTokenStrategy,
        AccessTokenGuard,
        RefreshTokenGuard,
        RefreshTokenStrategy,
        TokensProvider,
        {
            // if someone asks for HashingProvider, provide BcryptProvider
            provide: HashingProvider,
            useClass: BcryptHashingProvider,
        },
    ],
    exports: [AuthService, AccessTokenGuard, RefreshTokenGuard, HashingProvider],
    controllers: [AuthController],
})
export class AuthModule { }