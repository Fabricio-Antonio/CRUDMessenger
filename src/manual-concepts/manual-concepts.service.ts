import { Injectable } from '@nestjs/common';

@Injectable()
export class ManualConceptsService {
  HomeSolution(): string {
    return 'Home of manual concepts solution';
  }
}
