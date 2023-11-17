import { HttpStatus } from '@nestjs/common';
import { Exclude } from 'class-transformer';

export class ResponseEntity<T> {
  @Exclude() private readonly message: string;
  @Exclude() private readonly statusCode: number;
  @Exclude() private readonly data: T;

  private constructor(message: string, statusCode: number, data: T) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }

  static OK(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(message, HttpStatus.OK, '');
  }

  static OK_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(message, HttpStatus.OK, data);
  }
}
