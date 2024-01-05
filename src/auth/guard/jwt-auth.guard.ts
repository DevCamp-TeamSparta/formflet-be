import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const token = request.headers.authorization.replace('Bearer ', '');

      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

      request.user = decodedToken;
    } catch (e) {
      console.log(e);

      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Expired Token');
      } else if (e.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid Signature');
      } else if (e.name === 'TypeError') {
        throw new NotFoundException('Not Found AccessToken');
      }

      throw new InternalServerErrorException();
    }

    return super.canActivate(context);
  }
}
