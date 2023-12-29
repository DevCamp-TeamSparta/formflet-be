import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.replace('Bearer ', '');

    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      request.user = decodedToken;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Expired Token');
      }
      throw new UnauthorizedException('Unauthorized');
    }

    return super.canActivate(context);
  }
}
