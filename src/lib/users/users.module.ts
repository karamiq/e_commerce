import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
@Module({
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), PaginationModule],
})
export class UsersModule { }