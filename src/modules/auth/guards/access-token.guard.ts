import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS_KEY } from 'src/modules/permissions/decorators/permissions.decorator';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermission || requiredPermission.length === 0) {
      return true;
    }
    // Call parent to authenticate and attach user
    // the super.canActivate extracts and validates the JWT, attaching the user to the request
    // If authentication fails, it will throw an UnauthorizedException at the handleRequest step below
    // calls the AccessTokenStrategy validate method in the access-token.strategy.ts
    // Attaches the user object (with permissions) to request.user
    // the super.canActivete triggers handleRequest below after successful authentication
    // so we can check permissions after user is attached to request object
    const result = await super.canActivate(context);
    if (!result) {
      return false;
    }
    // Check permissions after user is attached
    const userPermissions = context.switchToHttp().getRequest().user?.permissions;

    // if the user has no permissions at all then thats just a customer which cannot access protected routes
    // unless its a public route
    //if (!userPermissions) {
    //  throw new UnauthorizedException('Insufficient permissions to access this resource');
    //}
    // Check if user has ALL required permissions
    const hasAllPermissions = userPermissions.includes(requiredPermission);
    if (!hasAllPermissions) {
      throw new UnauthorizedException('Insufficient permissions to access this resource');
    }
    return true;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or expired access token');
    }

    return user;
  }

}
