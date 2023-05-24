import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user: { userId: string }; // Define the user property with the desired type
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log('Middleware is executing');
    console.log('Authorization header:', req.headers.authorization);

    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent in the Authorization header as "Bearer <token>"

    if (!token) {
      console.log('Token not found');
      next();
      return;
    }

    try {
      const decoded = jwt.verify(token, 'your-secret-key'); // Verify the token using your secret key
      console.log('Decoded object:', decoded);
      req.user = { userId: decoded.userId }; // Set the user data in the request object
      console.log('Request user:', req.user);
    } catch (err) {
      console.log('Token verification failed');
    }

    next();
  }
}

