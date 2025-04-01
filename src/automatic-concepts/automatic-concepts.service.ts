import { Injectable } from '@nestjs/common';

@Injectable()
export class AutomaticConceptsService {
  getHome() {
    return 'automatic-concepts (AutomaticConceptsService)';
  }
}
