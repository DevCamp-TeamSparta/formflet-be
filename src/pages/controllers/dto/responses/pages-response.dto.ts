import { PartialType } from '@nestjs/mapped-types';
import { PagesRequestDto } from '../requests/pages-request.dto';

export class PagesResponseDto extends PartialType(PagesRequestDto) {}
