import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import * as bcrypt from 'bcrypt';
import { RefreshTokenInterface } from '../interfaces/refresh-token.interface';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);

    const refreshTokenEntity: RefreshTokenInterface = this.refreshTokenRepository.create({
      userId: userId,
      refreshToken: hashedRefreshToken,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);
  }
}
