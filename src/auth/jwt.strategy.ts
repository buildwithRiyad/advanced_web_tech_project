import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../customer/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', 
    });
  }

  async validate(payload: any) {
   
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });

    
    if (!user || !user.accessToken) {
      throw new UnauthorizedException('Session expired or user logged out. Please login again.');
    }

    return { userId: payload.sub, username: payload.username };
  }
}