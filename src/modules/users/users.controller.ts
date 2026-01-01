import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dtos/delete-user.dto';
import User from './user.entity';
import { GetUsersDto } from './dtos/get-user.dto';
import { StatusFilter } from 'src/common/pagination/dtos/pagination-query.dto';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @PermissionsDeco(PermissionsConstants.users.read)
    @ApiOperation({ summary: 'Search and filter users' })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search by user name, email, or phone number',
        example: 'john',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: StatusFilter,
        description: 'Filter by status (active, deleted, or all)',
        example: StatusFilter.ACTIVE,
    })

    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
        example: 10,
    })
    @ApiOkResponse({
        description: 'List of filtered users with pagination.',
    })
    async getUsers(@Query() getUsersDto: GetUsersDto) {
        return this.usersService.getUsers(getUsersDto);
    }

    @Get(':id')
    @PermissionsDeco(PermissionsConstants.users.read)
    @ApiOperation({ summary: 'Retrieve a user by ID' })
    @ApiOkResponse({
        description: 'The user has been successfully retrieved.',
        type: User,
    })
    @ApiBadRequestResponse({ description: 'Invalid user ID supplied.' })

    async getUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }

    // use the id of customer/employee to get the full user profile
    // @Get('profile/:id')
    // @ApiOperation({ summary: 'Retrieve full user profile by customer/employee ID' })
    // @ApiOkResponse({
    //     description: 'The user profile has been successfully retrieved.',
    //     type: User,
    // })
    // @ApiBadRequestResponse({ description: 'Invalid customer/employee ID supplied.' })
    // async getUserProfile(@Param('id') id: string) {
    //     return this.usersService.getUserProfileByRelatedId(id);
    // }


    @Delete('soft/:id')
    @PermissionsDeco(PermissionsConstants.users.delete)
    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiOkResponse({ description: 'The user has been successfully deleted.' })
    @ApiBadRequestResponse({ description: 'Invalid user ID supplied.' })
    async deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

    @Delete('hard/:id')
    @PermissionsDeco(PermissionsConstants.users.delete)
    @ApiOperation({ summary: 'Hard delete a user by ID' })
    @ApiOkResponse({ description: 'The user has been successfully hard deleted.' })
    @ApiBadRequestResponse({ description: 'Invalid user ID supplied.' })
    async hardDeleteUser(@Param('id') id: string) {
        return this.usersService.hardRemove(id);
    }
}