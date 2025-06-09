import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const id = parseInt(value, 10);

    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    if (id <= 0) {
      throw new BadRequestException('ID must be a positive number');
    }

    return id;
  }
}
