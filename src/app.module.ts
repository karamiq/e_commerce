import { PaginationModule } from './common/pagination/pagination.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './lib/auth/auth.module';
import { CustomersModule } from './lib/customers/customers.module';
import { EmployeesModule } from './lib/employees/employees.module';
import { NotificationsModule } from './lib/notifications/notifications.module';
import { ProductModule } from './lib/product/product.module';
import { UsersModule } from './lib/users/users.module';
import { AddressesModule } from './lib/addresses/addresses.module';
import { RolesModule } from './lib/roles/roles.module';
import { PermissionsModule } from './lib/permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './lib/auth/guards/access-token.guard';

@Module({
  imports: [
    PaginationModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    CustomersModule,
    EmployeesModule,
    NotificationsModule,
    ProductModule,
    AddressesModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '200411',
      database: 'auth',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: PermissionsGuard
    // }
  ],
})
export class AppModule { }
