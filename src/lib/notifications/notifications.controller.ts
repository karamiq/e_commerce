import { Controller, Get } from '@nestjs/common';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import type ActiveUserData from '../auth/interfaces/active-user-data.interface';
import { PermissionsDeco } from '../permissions/decorators/permissions.decorator';
import { PermissionsConstants } from '../permissions/constants/permissions.constants';

@Controller('notifications')
export class NotificationsController {
  @Get('all-notifications')
  @PermissionsDeco(PermissionsConstants.notifications.read)
  async getAllNotifications(@ActiveUser() user: ActiveUserData) {
    return {
      message: 'All notifications retrieved successfully',
      userId: user.sub,
    };
  }
}
