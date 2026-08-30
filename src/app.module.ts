import { PaginationModule } from './common/pagination/pagination.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './lib/auth/auth.module';
import { CustomersModule } from './lib/customers/customers.module';
import { EmployeesModule } from './lib/employees/employees.module';
import { NotificationsModule } from './lib/notifications/notifications.module';
import { UsersModule } from './lib/users/users.module';
import { AddressesModule } from './lib/addresses/addresses.module';
import { RolesModule } from './lib/roles/roles.module';
import { PermissionsModule } from './lib/permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './lib/auth/guards/access-token.guard';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import environmentValidation from './config/environment.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      load: [appConfig, databaseConfig, jwtConfig],
      validationSchema: environmentValidation,
    }),
    PaginationModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    CustomersModule,
    EmployeesModule,
    NotificationsModule,
    AddressesModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),
        username: configService.getOrThrow<string>('database.user'),
        password: configService.getOrThrow<string>('database.password'),
        database: configService.getOrThrow<string>('database.name'),
        synchronize: configService.get<boolean>('database.synchronize'),
        autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard
    // }
  ],
})
export class AppModule { }
