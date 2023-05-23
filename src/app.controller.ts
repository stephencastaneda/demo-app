import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


@Post('/login')
login(@Body() { email, password }): any {
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

    return { success: true, data: userData };
  } else {
    return { success: false, message: 'Invalid email or password' };
  }
}
  @Get('/user')
  getUser(): any {
    return this.appService.getUserData();
  }
}