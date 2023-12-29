import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TokenRepository } from '../repository/token.repository';
import * as bcrypt from 'bcrypt';
import { TokenInterface } from '../interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { Token } from '../entities/token.entity';

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger('TokenService');

  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: TokenRepository,
  ) {}

  generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
      },
      {
        secret: process.env.TOKEN_SECRET_KEY,
        expiresIn: '5m',
      },
    );
  }

  async generateRefreshToken({ user, res }): Promise<void> {
    const refreshToken: string = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
      },
      {
        secret: process.env.TOKEN_SECRET_KEY,
        expiresIn: '2w',
      },
    );

    const cookieConfig = {
      maxAge: 60000 * 60 * 24 * 14,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    };

    res.cookie('Refresh-Token', refreshToken, cookieConfig);

    await this.saveRefreshToken(user.id, refreshToken);
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedToken: string = await bcrypt.hash(refreshToken, 10);

    const tokenEntity: TokenInterface = this.repository.create({
      userId: userId,
      refreshToken: hashedToken,
    });

    await this.repository.save(tokenEntity);
  }

  async deleteRefreshToken(userId: number): Promise<void> {
    this.logger.log('delete refreshToken');

    try {
      await this.repository.delete(userId);
    } catch (e) {
      throw new InternalServerErrorException('refreshToken 삭제 오류발생');
    }
  }

  getUserIdByRefreshToken(refreshToken: string): number {
    const user = this.jwtService.verify(refreshToken, {
      secret: process.env.TOKEN_SECRET_KEY,
    });

    return user.id;
  }

  async getRefreshTokenByUserId(userId: number): Promise<Token> {
    return this.repository.findByUserId(userId);
  }

  async checkRefreshToken(rfrTokenInCookie: string, rfrTokenInDb: Token): Promise<boolean> {
    return await bcrypt.compare(rfrTokenInCookie, rfrTokenInDb.refreshToken);
  }
}
