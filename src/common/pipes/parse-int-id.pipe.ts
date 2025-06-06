import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const id = parseInt(value, 10);

    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    if (id <= 0) {
      throw new BadRequestException('ID must be a positive number');
    }

    console.log('PIPE value', value);
    console.log('PIPE metadata', metadata);
    return id;
  }
}
