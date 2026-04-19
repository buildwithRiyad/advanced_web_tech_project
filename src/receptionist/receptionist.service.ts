// src/receptionist/receptionist.service.ts

import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { Complaint } from './entities/complaint.entity';
import { Receptionist } from './entities/receptionist.entity';

import { CreateBookingDto, UpdateBookingDto, PaymentDto, ComplaintDto } from './dto/receptionist.dto';

@Injectable()
export class ReceptionistService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Complaint) private readonly complaintRepo: Repository<Complaint>,
    @InjectRepository(Receptionist) private readonly receptionistRepo: Repository<Receptionist>,
    private readonly mailerService: MailerService,
  ) {}

  // Signup
  async createReceptionist(data: any) {
    const existingUser = await this.receptionistRepo.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('An account has already been opened with this email.');
    }

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const newRes = this.receptionistRepo.create({
        ...data,
        password: hashedPassword,
      });

      const savedUser = await this.receptionistRepo.save(newRes);
      const { password, ...result } = savedUser as any; 
      
      return { message: 'Receptionist account created successfully', data: result };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create receptionist account.');
    }
  }

  //add-booking
  async createBooking(dto: CreateBookingDto, receptionistId: number) {
    try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newBooking = this.bookingRepo.create({
      ...dto,
      password: hashedPassword, 
      receptionist: { id: receptionistId } 
    });

    const savedBooking = await this.bookingRepo.save(newBooking);

    const { password, ...result } = savedBooking;

      try {
        await this.mailerService.sendMail({
          to: 'mahbubhasan2248@gmail.com', 
          subject: 'Booking Confirmation - Hotel Management System',
          html: `
            <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd;">
              <h2 style="color: #2c3e50;">Booking Confirmed!</h2>
              <p>Hello <b>${dto.guestName}</b>,</p>
              <p>Your booking for Room <b>${dto.roomNumber}</b> has been successfully saved.</p>
              <p>Check-in Date: ${dto.checkInDate}</p>
              <p>Document Uploaded: <b>${dto.nidFileName}</b></p>
              <br>
              <p>Regards,<br>Hotel Management Team</p>
            </div>
          `,
        });
        console.log("Email sent successfully!");
      } catch (mailError: any) {
        console.error("Email failed to send:", mailError.message);
      }

      return { message: 'Booking created successfully with NID document', data: savedBooking };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to save booking.');
    }
  }

  // (One-to-One Relation)
  async postPayment(dto: PaymentDto, bookingId: number) {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found.');

    const newPayment = this.paymentRepo.create({
      ...dto,
      booking: { id: bookingId }
    });
    return await this.paymentRepo.save(newPayment);
  }

  async getBill(bookingId: number) {
    const booking = await this.bookingRepo.findOne({ 
      where: { id: bookingId }, 
      relations: ['payment'] 
    });

    if (!booking || !booking.payment) {
      throw new NotFoundException('No payment record found for this booking.');
    }

    return { 
      guestName: booking.guestName, 
      totalBill: booking.payment.amount, 
      status: booking.payment.status,
      method: booking.payment.paymentMethod
    };
  }

  // (Many-to-One Relation)
  async saveComplaint(dto: ComplaintDto, receptionistId: number) {
    try {
      const newComplaint = this.complaintRepo.create({
        guestName: dto.guestName,
        roomNumber: dto.roomNumber,
        issue: dto.description,
        priority: dto.priority,
        receptionist: { id: receptionistId }
      });
      return await this.complaintRepo.save(newComplaint);
    } catch (err) {
      throw new InternalServerErrorException('Failed to save complaint.');
    }
  }

  // --- Standard CRUD Operations ---

  async getBookingById(id: number) {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['receptionist', 'payment'] });
    if (!booking) throw new NotFoundException('Booking not found.');
    return booking;
  }

  async getAllBookings() { 
    return await this.bookingRepo.find({ relations: ['receptionist', 'payment'] }); 
  }

  async deleteBooking(id: number) { 
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');
    await this.bookingRepo.delete(id); 
    return { message: `Booking with ID ${id} deleted successfully.` }; 
  }

  async updateBooking(id: number, dto: UpdateBookingDto) { 
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found.');
    
    await this.bookingRepo.update(id, dto); 
    return { message: 'Booking updated successfully' }; 
  }

  // --- Requirement 4: Relationship Manipulation ---

  // (One-to-One Update)
  async updatePaymentByBooking(bookingId: number, dto: PaymentDto) {
    const booking = await this.bookingRepo.findOne({ 
      where: { id: bookingId }, 
      relations: ['payment'] 
    });

    if (!booking || !booking.payment) {
      throw new NotFoundException('Payment record not found for this booking.');
    }

    await this.paymentRepo.update(booking.payment.id, dto);
    return { message: 'Payment updated successfully via relationship' };
  }

  // Many-to-One Update
  async changeBookingReceptionist(bookingId: number, newResId: number) {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found.');

    const receptionist = await this.receptionistRepo.findOne({ where: { id: newResId } });
    if (!receptionist) throw new NotFoundException('New Receptionist not found.');

    booking.receptionist = receptionist; 
    return await this.bookingRepo.save(booking);
  }

  // One-to-Many Read
  async getBookingsByReceptionist(resId: number) {
    const receptionist = await this.receptionistRepo.findOne({
      where: { id: resId },
      relations: ['bookings' ]
       
    });
    if (!receptionist) throw new NotFoundException('Receptionist not found');
    return receptionist.bookings;
  }

  // One-to-Many Delete
  async deleteComplaintsByReceptionist(resId: number) {
    const receptionist = await this.receptionistRepo.findOne({ where: { id: resId } });
    if (!receptionist) throw new NotFoundException('Receptionist not found');

    const result = await this.complaintRepo.delete({ receptionist: { id: resId } });
    if (result.affected === 0) throw new NotFoundException('No complaints found for this receptionist');
    
    return { message: `Deleted ${result.affected} complaints for Receptionist ID ${resId}.` };
  }
}