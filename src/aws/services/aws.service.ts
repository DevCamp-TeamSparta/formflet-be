import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDomainDto } from '../../pages/dtos/requests/register-domain.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private readonly route53: AWS.Route53;

  constructor() {
    AWS.config.update({
      accessKeyId: 'sdaf',
      region: process.env.REGION,
    });
    this.route53 = new AWS.Route53();
  }

  async registerDomain(registerDomainDto: RegisterDomainDto): Promise<string> {
    const registerDomain: string = registerDomainDto.domain;

    const hostedZoneId: string = process.env.HOSTED_ZONE_ID; // Route 53에서 찾을 수 있는 호스팅 존 ID
    const baseDomain: string = process.env.DOMAIN; // 도메인 이름

    const changeBatch = {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: `${registerDomain}.${baseDomain}`,
            Type: 'CNAME',
            TTL: 300,
            ResourceRecords: [
              {
                Value: 'test', // 실제로는 이 부분을 원하는 대상으로 설정해야 합니다.
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
      return `${registerDomain}.${baseDomain}`;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('오류발생');
    }
  }
}
