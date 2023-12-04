import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersResponseDto } from '../../users/controllers/dtos/responses/users-response.dto';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): UsersResponseDto => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
