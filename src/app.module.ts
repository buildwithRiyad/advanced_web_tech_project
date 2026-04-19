// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceptionistModule } from './receptionist/receptionist.module';

import { Booking } from './receptionist/entities/booking.entity';
import { Payment } from './receptionist/entities/payment.entity';
import { Complaint } from './receptionist/entities/complaint.entity';
import { Receptionist } from './receptionist/entities/receptionist.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Database Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',       
      password: 'mithil123',   
      database: 'hotel_db',        
      entities: [Receptionist, Booking, Payment, Complaint], 
      synchronize: true, 
    }),

    // Mailer Configuration (Updated for Gmail) 
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true, 
        auth: {
          user: 'mahbubmithil776@gmail.com',
          pass: 'gpgk vyjk npcr nrxh', 
        },
        tls: {
          rejectUnauthorized: false, 
        },
      },
      defaults: {
        from: '"Hotel Management" <mahbubmithil776@gmail.com>', 
      },
    }),
    AuthModule,
    ReceptionistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}