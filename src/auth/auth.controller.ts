import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserDocument } from './user.model';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly secretKey = 'your-secret-key';

  constructor(
    private readonly authService: AuthService,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  @Post('/register')
  async register(@Body() { email, password, firstName, lastName }): Promise<any> {
    console.log('Received firstName:', firstName);
    console.log('Received lastName:', lastName);

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    console.log('Saving user:', user);

    const result = await user.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, this.secretKey, { expiresIn: '1h' });

    return {
      success: true,
      message: 'User registered successfully',
      userId: result._id,
      token,
      firstName: user.firstName,
    };
  }

  @Post('/login')
  async login(@Body() { email, password }): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, this.secretKey, { expiresIn: '1h' });

    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return { success: true, message: 'Login successful', data: userData, token };
  }

  @Get('/user')
  async getUser(@Req() req): Promise<any> {

    const loggedInUserId = req.user?.userId; 
    console.log('logged in user id', loggedInUserId)

    const user = await this.userModel.findById(loggedInUserId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return { success: true, data: userData };
  }

  @Get('/test')
async testRoute(): Promise<string> {
  return 'Test route works!';
}
}

