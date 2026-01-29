import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule,
        JwtModule
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService],
})
export class NotificationsModule { }