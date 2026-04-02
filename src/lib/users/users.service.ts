import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import * as bcrypt from 'bcrypt';

import { GetUsersDto } from './dtos/get-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { HashingProvider } from '../auth/providers/hashing-provider';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { StatusFilter } from 'src/common/pagination/dtos/pagination-query.dto';
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly hashingProvider: HashingProvider,
        private readonly paginationService: PaginationService,
    ) {
    }

    async getUsers(getUsersDto: GetUsersDto) {
        const { search, status, page, limit } = getUsersDto;

        const query = this.usersRepository.createQueryBuilder('user');

        // Handle soft delete filtering
        switch (status) {
            case StatusFilter.DELETED:
                query.withDeleted().where('user.deletedAt IS NOT NULL');
                break;
            case StatusFilter.ALL:
                query.withDeleted();
                break;
            case StatusFilter.ACTIVE:
            default:
                // By default, TypeORM excludes soft-deleted records
                break;
        }

        // Search by name, email, or phone number
        if (search) {
            query.andWhere(
                '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR user.phoneNumber ILIKE :search)',
                { search: `%${search}%` },
            );
        }
        return await this.paginationService.paginateQueryBuilder<User>(
            query,
            { page, limit },
        );
    }
    async createUser(createUserDto: CreateUserDto) {
        const user = await this.getUserByEmail(createUserDto.email);
        if (user) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword = await this.hashingProvider.hash(createUserDto.password);
        const newUser = await this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        return this.usersRepository.update(id, updateUserDto);
    }
    async deleteUser(id: string) {
        // Remove employee if exists
        const user = await this.getUserById(id);
        if ((user as any).employee?.id) {
            const employeesRepo = (this as any).employeesRepository as Repository<any>;
            if (employeesRepo) {
                await employeesRepo.delete((user as any).employee.id);
            }
        }
        return this.usersRepository.softDelete(id);
    }
    async getUserById(id: string) {
        const user = await this.usersRepository.findOneBy({ id: id });
        if (!user) {
            throw new BadRequestException('User with ID ' + id + ' not found');
        }
        return user;
    }
    async getUserByEmail(email: string) {
        return this.usersRepository.findOneBy({ email: email });
    }

    async getUserByEmailForAuth(email: string) {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'firstName', 'lastName', 'phoneNumber', 'createAt'],
        });
    }

    async getUserByEmailWithRelations(email: string) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['employee', 'employee.role', 'customer'],
        });
    }
    async hardRemove(id: string) {
        return this.usersRepository.delete(id);
    }
}
