import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { TokenRepository } from '../repository/token.repository';
import * as bcrypt from 'bcrypt';
import { TokenInterface } from '../interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger('TokenService');

  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: TokenRepository,
  ) {}

  async generateAccessToken({ user, res }): Promise<void> {
    const accessToken: string = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
      },
      {
        secret: process.env.TOKEN_SECRET_KEY,
        expiresIn: '600m',
      },
    );

    res.setHeader('Authorization', `Bearer ${accessToken}`);
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

    res.setHeader('Refresh-Token', `Bearer ${refreshToken}`);

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
    this.logger.log('start delete refreshToken');

    try {
      await this.repository.delete(userId);
    } catch (e) {
      throw new InternalServerErrorException('refreshToken 삭제 오류발생');
    }
  }
}
