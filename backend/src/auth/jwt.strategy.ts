import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);

    const user = await this.authService.validateUser(payload.sub);
    console.log('User from DB in jwt strategy:', user);

    if (!user) {
      throw new UnauthorizedException();
    }

    const result = {
      id: user.id,
      email: user.email,
      role: Number(user.role),
      name: user.name,
    };

    console.log('User returned to request.user:', result);

    return result;
  }
}