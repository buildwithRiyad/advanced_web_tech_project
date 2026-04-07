import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../customer/entities/user.entity';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
   
    JwtModule.register({
      secret: 'secretKey', 
      signOptions: { expiresIn: '7h' },
    }),
    
    forwardRef(() => CustomerModule),
  ],
  providers: [AuthService, JwtStrategy],

  exports: [AuthService, JwtModule, PassportModule], 
})
export class AuthModule {}