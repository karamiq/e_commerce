import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import ActiveUserData from '../interfaces/active-user-data.interface';


export const ActiveUser = createParamDecorator<keyof ActiveUserData>(
  (data: keyof ActiveUserData, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request['user'] as ActiveUserData;
    return data ? user[data] : user;
  },
);
