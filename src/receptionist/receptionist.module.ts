// src/receptionist/receptionist.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ReceptionistController } from './receptionist.controller';
import { ReceptionistService } from './receptionist.service';

import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { Complaint } from './entities/complaint.entity';
import { Receptionist } from './entities/receptionist.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Receptionist, Booking, Payment, Complaint])
  ],
  controllers: [ReceptionistController],
  providers: [ReceptionistService],
})
export class ReceptionistModule {}