import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../customer/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: any) {
    const { username, password } = dto;
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password || ''))) {
      throw new UnauthorizedException('Username or Password does not match');
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    
    await this.userRepository.update(user.id, { accessToken: token });

    return {
      access_token: token,
    };
  }
}