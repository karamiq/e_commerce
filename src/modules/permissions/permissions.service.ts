import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from './entities/permissions.entity';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { GetPermissionsDto } from './dtos/get-permissions.dto';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    private readonly paginationService: PaginationService,
    private readonly rolesService: RolesService,
  ) { }

  async create(name: string, description?: string): Promise<Permissions> {
    const existingPermission = await this.permissionsRepository.findOne({ where: { name } });
    if (existingPermission) {
      throw new ConflictException('Permission with this name already exists');
    }

    const permission = this.permissionsRepository.create({ name, description });
    return await this.permissionsRepository.save(permission);
  }

  async findAll(getPermissionsDto: GetPermissionsDto) {
    return await this.paginationService.paginate<Permissions>(
      getPermissionsDto,
      this.permissionsRepository,
      {}
    );
  }

  async findOne(id: string) {
    const permission = await this.permissionsRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }
  async update(id: string, name?: string, description?: string): Promise<Permissions> {
    const permission = await this.findOne(id);

    if (name && name !== permission.name) {
      const existingPermission = await this.permissionsRepository.findOne({ where: { name } });
      if (existingPermission) {
        throw new ConflictException('Permission with this name already exists');
      }
      permission.name = name;
    }

    if (description !== undefined) {
      permission.description = description;
    }

    return await this.permissionsRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionsRepository.softDelete(id);
  }

  async getPermissionsByRoleId(roleId: string) {
    const role = await this.rolesService.findOne(roleId);
    return this.paginationService.paginate<Permissions>(
      new GetPermissionsDto(),
      this.permissionsRepository,
      {
        roles: { id: role.id }
      }
    );

  }
}
