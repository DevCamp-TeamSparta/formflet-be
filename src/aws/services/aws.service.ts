import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ResponseEntity } from '../../configs/response-entity';
import { RegisterDomainDto } from '../../pages/dtos/requests/register-domain.dto';

@Injectable()
export class AwsService {
  private readonly route53: AWS.Route53;

  constructor() {
    AWS.config.update({
      region: process.env.REGION,
    });
    this.route53 = new AWS.Route53();
  }

  async registerDomain(registerDomainDto: RegisterDomainDto): Promise<ResponseEntity<string>> {
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

      return ResponseEntity.OK('등록이 완료되었습니다.');
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
