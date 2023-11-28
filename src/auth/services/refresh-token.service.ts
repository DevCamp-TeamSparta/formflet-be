import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  constructor(@InjectRepository(RefreshToken) private repository: Repository<RefreshToken>) {}

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken: string = await bcrypt.hash(refreshToken, 10);

    const refreshTokenEntity: RefreshToken = this.repository.create({
      userId: userId,
      refreshToken: hashedRefreshToken,
    });

    await this.repository.save(refreshTokenEntity);
  }
}
