import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../users/repositories/user.repository';
import { User } from '../../users/entities/user.entity';
import { UsersResponseDto } from '../../users/controllers/dtos/responses/users-response.dto';
import { Builder } from 'builder-pattern';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      secretOrKey: process.env.TOKEN_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { id, exp } = payload;

    // Check if the token is expired
    if (Date.now() >= exp * 1000) {
      throw new UnauthorizedException('Expired Token');
    }

    const user: User = await this.userRepository.findById(id);

    if (!user) {
      throw new UnauthorizedException('Invalid User');
    }

    return Builder<UsersResponseDto>()
      .id(user.id)
      .email(user.email)
      .name(user.name)
      .mobile(user.mobile)
      .job(user.job)
      .build();
  }
}
