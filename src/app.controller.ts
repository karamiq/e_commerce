import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionsDeco } from './lib/permissions/decorators/permissions.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './lib/auth/decorators/public.decorator';

@Controller()
@ApiBearerAuth('access-token')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
