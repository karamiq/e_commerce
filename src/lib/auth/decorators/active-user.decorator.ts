import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import ActiveUserData from '../interfaces/active-user-data.interface';


export const ActiveUser = createParamDecorator<keyof ActiveUserData>(
  (data: keyof ActiveUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('ActiveUser Decorator - request.user:', request.user);
    const user = request.user;
    return data ? user[data] : user;
  },
);
