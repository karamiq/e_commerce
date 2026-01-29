import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';
import { GetRolesDto } from './dtos/get-role.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { Permissions } from '../permissions/entities/permissions.entity';
import { CreateRoleDto } from './dtos/create-role.dto';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    private readonly paginationService: PaginationService,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<Roles> {
    const { name, description, permissionIds } = createRoleDto;
    const existingRole = await this.rolesRepository.findOne({ where: { name } });
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.rolesRepository.create({ name, description });

    if (permissionIds && permissionIds.length > 0) {
      role.permissions = await this._validateAndFetchPermissions(permissionIds);
    }

    return await this.rolesRepository.save(role);
  }

  async findAll(getRolesDto: GetRolesDto) {
    return this.paginationService.paginate<Roles>(
      getRolesDto,
      this.rolesRepository,
      {
        name: getRolesDto.name ? ILike(`%${getRolesDto.name}%`) : undefined
      }
    );
  }

  async findOne(id: string): Promise<Roles> {
    const role = await this.rolesRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string): Promise<Roles> {
    const role = await this.rolesRepository.findOne({ where: { name } });
    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }
    return role;
  }

  async update(id: string, name?: string, description?: string): Promise<Roles> {
    const role = await this.findOne(id);

    if (name && name !== role.name) {
      const existingRole = await this.rolesRepository.findOne({ where: { name } });
      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
      role.name = name;
    }

    if (description !== undefined) {
      role.description = description;
    }

    return await this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.rolesRepository.softRemove(role);
  }

  async addPermissionsToRole(roleId: string, permissionIds: string[]): Promise<Roles> {
    const role = await this.findOne(roleId);
    const newPermissions = await this._validateAndFetchPermissions(permissionIds);

    role.permissions = newPermissions;
    return await this.rolesRepository.save(role);
  }

  async removePermissionsFromRole(roleId: string, permissionIds: string[]): Promise<Roles> {
    const role = await this.findOne(roleId);

    role.permissions = role.permissions.filter(p => !permissionIds.includes(p.id));
    return await this.rolesRepository.save(role);
  }

  private async _validateAndFetchPermissions(permissionIds: string[]): Promise<Permissions[]> {
    if (!permissionIds || permissionIds.length === 0) {
      return [];
    }

    const permissions = await this.permissionsRepository.findBy({ id: In(permissionIds) });
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('Some permissions were not found');
    }
    return permissions;
  }
}
