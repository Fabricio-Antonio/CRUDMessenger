import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Alright');
    setTimeout(() => {
      next();
    }, 2000);
  }
}
