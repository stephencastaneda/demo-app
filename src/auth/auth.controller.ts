import { Controller, Post, Body, Get, Req, Res, HttpStatus, Redirect } from '@nestjs/common';
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
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    try {
      const savedUser = await user.save();
      const token = jwt.sign({ userId: savedUser._id, email: savedUser.email }, this.secretKey, { expiresIn: '1h' });

      const userData = {
        id: savedUser._id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName
      };

      return { success: true, message: 'Registration successful', data: userData, token };
    } catch (error) {
      return { success: false, message: 'Registration failed', error };
    }
  }

  @Post('/login')
  async login(@Body() { email, password, facebookId }): Promise<any> {
    if (facebookId) {
      const user = await this.authService.validateFacebookLogin(facebookId);
      if (!user) {
        return { success: false, message: 'Invalid Facebook login' };
      }

      const token = jwt.sign({ userId: user._id, email: user.email }, this.secretKey, { expiresIn: '1h' });

      const userData = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };

      return { success: true, message: 'Login successful', data: userData, token };
    } else {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        return { success: false, message: 'Invalid email or password' };
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
  }

  @Get('/user')
async getUser(@Req() req): Promise<any> {
  const loggedInUserId = req.user?.userId;

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

  @Get('/auth/facebook')
  @Redirect('https://www.facebook.com/v13.0/dialog/oauth', 302)
  facebookLogin() {
    const queryParams = new URLSearchParams({
      client_id: '183252494682576',
      redirect_uri: 'https://9356-2603-8000-7b00-a096-f49f-6cc3-5758-1e1d.ngrok-free.app/auth/facebook/callback',
      scope: 'email',
    }).toString();
    return {
      url: `https://www.facebook.com/v13.0/dialog/oauth?${queryParams}`,
    };
  }

  @Get('/auth/facebook/callback')
  async facebookCallback(@Req() req, @Res() res): Promise<any> {
    const { code } = req.query;
    const user = await this.authService.loginWithFacebook(code);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Invalid Facebook login' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, this.secretKey, { expiresIn: '1h' });

    const userData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
}
