import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfoDto } from '../../users/controllers/dtos/responses/user-info.dto';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): UserInfoDto => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
