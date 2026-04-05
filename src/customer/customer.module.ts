import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Booking } from './entities/booking.entity';
import { Room } from './entities/room.entity'; // নতুন ইম্পোর্ট
import { Review } from './entities/review.entity'; // নতুন ইম্পোর্ট

@Module({
  imports: [
    // সব Entity এখানে কমা দিয়ে লিখে দিন
    TypeOrmModule.forFeature([Booking, Room, Review]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}