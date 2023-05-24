import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user: { userId: string }; 
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, 'your-secret-key'); 
      req.user = { userId: decoded.userId }; 
    } catch (err) {
    }

    next();
  }
}

