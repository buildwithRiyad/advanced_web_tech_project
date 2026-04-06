import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Booking } from './entities/booking.entity';
import { Room } from './entities/room.entity'; 
import { Review } from './entities/review.entity'; 

@Module({
  imports: [
    
    TypeOrmModule.forFeature([Booking, Room, Review]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}