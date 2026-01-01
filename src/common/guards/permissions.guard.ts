/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from 'src/modules/permissions/decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if route is public
    console.log('PermissionsGuard - canActivate called');
    const user = context.switchToHttp().getRequest().user;
    console.log('PermissionsGuard - user:', user);
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    var permission = this.reflector.getAllAndOverride<string>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('🔐 Permission Check:');
    console.log('   Required permission:', permission);
    console.log('   User permissions:', user?.permissions);
    console.log('   Has permission?:', user?.permissions?.includes(permission));
    return user?.permissions?.includes(permission);
  }
}