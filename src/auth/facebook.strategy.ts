import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';
import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: '183252494682576',
      clientSecret: '70debf9d28542544ccbfea9b08ef224f',
      callbackURL: 'https://9356-2603-8000-7b00-a096-f49f-6cc3-5758-1e1d.ngrok-free.app/auth/facebook/callback',
      profileFields: ['id', 'email', 'name', 'picture'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    
    const user = await this.authService.validateFacebookLogin(profile.id);
  
    if (user) {
      user.facebookAccessToken = accessToken;
      user.facebookRefreshToken = refreshToken;
      await user.save();
  
      const { password, ...userData } = user;
      return userData;
    }
  
    return null;
  }
  
}
