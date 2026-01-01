import { Controller, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Get } from '@nestjs/common';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type ActiveUserData from '../auth/interfaces/active-user-data.interface';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';
@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
    @Get('all-notifications')
    @PermissionsDeco(PermissionsConstants.notifications.read)
    @ApiOperation({ summary: 'Get all notifications' })
    @ApiOkResponse({ description: 'All notifications retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Failed to retrieve notifications' })
    async getAllNotifications(@ActiveUser() user: ActiveUserData) {
        return {
            message: 'All notifications retrieved successfully',
            userId: user.sub,
        }
    }
}