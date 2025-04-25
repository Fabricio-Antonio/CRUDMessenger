import { Injectable } from '@nestjs/common';

@Injectable()
export class NotesUtils {
  invertStrintg(str: string): string {
    return str.split('').reverse().join('');
  }
}
