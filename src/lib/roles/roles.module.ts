import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Roles } from './entities/roles.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { Permissions } from '../permissions/entities/permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Permissions]), PaginationModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule { }
