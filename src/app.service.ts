import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  login(email: string, password: string): any {
    // Mock user data
    const users = [
      { id: 1, email: 'test@example.com', password: 'password123' },
      { id: 2, email: 'user@example.com', password: 'test123' },
    ];

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      // Mock user data to return upon successful login
      const userData = {
        id: user.id,
        email: user.email,
        name: 'John Doe',
      };

      return { success: true, data: userData, message: 'You can login' };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  }
  getUserData(): any {
    // Mock user data
    const userData = {
      id: 1,
      email: 'test@example.com',
      name: 'John Doe',
    };

    return { success: true, data: userData };
  }
}