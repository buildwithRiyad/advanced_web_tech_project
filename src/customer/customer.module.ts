import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Booking } from './entities/booking.entity';
import { Room } from './entities/room.entity'; 
import { Review } from './entities/review.entity'; 
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { PusherService } from '../pusher.service'; // ১. এটি ইমপোর্ট করো

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Room, Review, User]),
    forwardRef(() => AuthModule), 
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService, 
    PusherService // ২. এখানে PusherService অ্যাড করো
  ],
  exports: [CustomerService, TypeOrmModule],
})
export class CustomerModule {}