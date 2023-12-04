import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DomainsRepository } from '../repositories/domains.repository';
import { User } from '../../users/entities/user.entity';
import { DomainsRequestDto } from '../controllers/dtos/requests/domains-request.dto';
import { ResponseEntity } from '../../configs/response-entity';
import { DomainsResponseDto } from '../controllers/dtos/responses/domains-response.dto';
import { Domain } from '../entites/domains.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DomainsService {
  private readonly route53: AWS.Route53;

  constructor(private readonly domainsRepository: DomainsRepository) {
    AWS.config.update({
      region: process.env.REGION,
    });
    this.route53 = new AWS.Route53();
  }

  async registerDomain(user: User, domainsRequestDto: DomainsRequestDto): Promise<ResponseEntity<DomainsResponseDto>> {
    const userId: number = user.id;
    const customDomain: string = domainsRequestDto.customDomain;
    const value: string = domainsRequestDto.value;

    const hostedZoneId: string = process.env.HOSTED_ZONE_ID; // Route 53에서 찾을 수 있는 호스팅 존 ID
    const baseDomain: string = process.env.DOMAIN; // 도메인 이름

    const changeBatch = {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: `${customDomain}.${baseDomain}`,
            Type: 'CNAME',
            TTL: 300,
            ResourceRecords: [
              {
                Value: value,
              },
            ],
          },
        },
      ],
    };

    const params = {
      ChangeBatch: changeBatch,
      HostedZoneId: hostedZoneId,
    };

    try {
      await this.route53.changeResourceRecordSets(params).promise();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }

    return await this.saveDomain(userId, domainsRequestDto);
  }

  async saveDomain(userId: number, domainsRequestDto: DomainsRequestDto): Promise<ResponseEntity<DomainsResponseDto>> {
    const { customDomain, value } = domainsRequestDto;

    const domain: Domain = this.domainsRepository.create({
      userId,
      customDomain,
      value,
    });

    try {
      await this.domainsRepository.save(domain);

      const data: DomainsResponseDto = plainToInstance(DomainsResponseDto, domain);

      return ResponseEntity.OK_WITH_DATA('도메인이 생성되었습니다.', data);
    } catch (e) {
      if (e.errno === 1062) {
        throw new ConflictException('이미 존재하는 도메인 입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
