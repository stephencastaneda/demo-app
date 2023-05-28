import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import axios from 'axios';
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  getHello(): string {
    return 'Hello World!';
  }

  login(email: string, password: string): any {
    const users = [
      { id: 1, email: 'test@example.com', password: 'password123' },
      { id: 2, email: 'user@example.com', password: 'test123' },
    ];

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
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
    const userData = {
      id: 1,
      email: 'test@example.com',
      name: 'John Doe',
    };

    return { success: true, data: userData };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const users = [
      { id: 1, email: 'test@example.com', password: 'password123' },
      { id: 2, email: 'user@example.com', password: 'test123' },
    ];

    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateFacebookLogin(facebookId: string): Promise<any> {
    const users = [
      { id: 1, email: 'test@example.com', password: 'password123', facebookId: 'facebook123' },
      { id: 2, email: 'user@example.com', password: 'test123', facebookId: 'facebook456' },
    ];

    const user = users.find((user) => user.facebookId === facebookId);

    if (user) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async loginWithFacebook(code: string): Promise<UserDocument | null> {
    try {
      const accessTokenResponse = await axios.get(
        `https://graph.facebook.com/v13.0/oauth/access_token`,
        {
          params: {
            client_id: 'your-client-id',
            client_secret: 'your-client-secret',
            redirect_uri: 'http://localhost:3000/auth/facebook/callback',
            code,
          },
        }
      );

      const { access_token: accessToken } = accessTokenResponse.data;

      const profileResponse = await axios.get(
        `https://graph.facebook.com/v13.0/me`,
        {
          params: {
            fields: 'id,email,first_name,last_name',
            access_token: accessToken,
          },
        }
      );

      const { id, email, first_name: firstName, last_name: lastName } = profileResponse.data;

      let user = await this.userModel.findOne({ facebookId: id });

      if (!user) {
        user = new this.userModel({
          email,
          facebookId: id,
          firstName,
          lastName,
        });

        user = await user.save();
      }

      return user;
    } catch (error) {
      console.error('Facebook login error:', error);
      return null;
    }
  }
}




