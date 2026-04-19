// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receptionist } from '../receptionist/entities/receptionist.entity';
import * as bcrypt from 'bcrypt'; // BCrypt import

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Receptionist)
    private receptionistRepo: Repository<Receptionist>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: any) {
    const { email, password } = loginDto;

    const user = await this.receptionistRepo.findOne({ where: { email } });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password);

      if (isPasswordMatching) {
        const payload = { email: user.email, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
          user: { id: user.id, name: user.name }
        };
      }
    }

    throw new UnauthorizedException('Incorrect email or password. Please try again.');
  }
}