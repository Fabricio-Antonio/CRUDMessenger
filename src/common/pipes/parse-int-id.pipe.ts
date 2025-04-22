import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('ParseIntIdPipe wait a numeric string.');
    }

    if (parsedValue < 0) {
      throw new BadRequestException(
        'ParsedIntIdPipe wait a number above than zero.',
      );
    }

    console.log('PIPE value', value);
    console.log('PIPE metadata', metadata);
    return value;
  }
}
