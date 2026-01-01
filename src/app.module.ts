import { PaginationModule } from './common/pagination/pagination.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ProductModule } from './modules/product/product.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './modules/auth/guards/access-token.guard';

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