import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Booking } from './entities/booking.entity';
import { Room } from './entities/room.entity';
import { Review } from './entities/review.entity';
import { User } from './entities/user.entity'; 
import { CreateBookingDto } from './dto/create-booking.dto';
import { MailerService } from '@nestjs-modules/mailer'; // মেইলার ইমপোর্ট
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService, 
  ) {}

 
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  
  async signUp(dto: any) {
    const { username, password } = dto;
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) throw new ConflictException('Username already exists');

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role: 'customer',
    });

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

 
  async getRoomsByExactPrice(price?: number) {
    return await this.roomRepository.find({ where: price ? { price } : {} });
  }

 async createBooking(dto: CreateBookingDto) {
  const room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
  if (!room) throw new NotFoundException('Room not found');

  const checkIn = this.parseDate(dto.checkInDate);
  const checkOut = this.parseDate(dto.checkOutDate);

  const overlapping = await this.bookingRepository
    .createQueryBuilder('booking')
    .where('booking.roomId = :roomId', { roomId: dto.roomId })
    .andWhere(
      '(booking.checkInDate < :checkOutDate AND booking.checkOutDate > :checkInDate)',
      { checkInDate: checkIn, checkOutDate: checkOut }
    )
    .getOne();

  if (overlapping) {
    throw new ConflictException('Sorry, this room is already booked for these dates.');
  }

  const booking = this.bookingRepository.create({
    ...dto,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    room: room,
    status: 'Booked'
  });
  
  const savedBooking = await this.bookingRepository.save(booking);

  try {
    await this.mailerService.sendMail({
      to: dto.email, 
      subject: 'Booking Confirmation - Hotel UniConnect',
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #4CAF50;">Booking Successful!</h2>
          <p>Hello <b>${dto.customerName}</b>,</p>
          <p>Your room booking has been confirmed at <b>Hotel Urban</b>.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Room ID</b></td><td style="padding: 8px; border: 1px solid #ddd;">${dto.roomId}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Check-in Date</b></td><td style="padding: 8px; border: 1px solid #ddd;">${dto.checkInDate}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Check-out Date</b></td><td style="padding: 8px; border: 1px solid #ddd;">${dto.checkOutDate}</td></tr>
          </table>
          <p>We look forward to seeing you!</p>
        </div>
      `,
    });
    console.log('Confirmation email sent to:', dto.email);
  } catch (error: any) {
    console.error('Email sending failed:', error.message);
  }

  
  const finalResponse: any = { ...savedBooking };

  //delete finalResponse.room; 

  return finalResponse;
}

  async updateBooking(id: number, dto: any) {
    const booking = await this.bookingRepository.findOne({ 
      where: { id },
      relations: ['room'] 
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (dto.roomId) {
      const room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
      if (!room) throw new NotFoundException(' Room not found');
      booking.room = room;
    }

    const checkIn = dto.checkInDate ? this.parseDate(dto.checkInDate) : booking.checkInDate;
    const checkOut = dto.checkOutDate ? this.parseDate(dto.checkOutDate) : booking.checkOutDate;
    const roomId = dto.roomId || (booking.room ? booking.room.id : null);

    if (roomId) {
      const overlapping = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.roomId = :roomId', { roomId })
        .andWhere('booking.id != :id', { id }) 
        .andWhere(
          '(booking.checkInDate < :checkOutDate AND booking.checkOutDate > :checkInDate)',
          { checkInDate: checkIn, checkOutDate: checkOut }
        )
        .getOne();

      if (overlapping) {
        throw new ConflictException('Conflict: Room already booked for these dates.');
      }
    }

    const { roomId: _, ...updateData } = dto;
    if (dto.checkInDate) updateData.checkInDate = checkIn;
    if (dto.checkOutDate) updateData.checkOutDate = checkOut;

    Object.assign(booking, updateData);
    const updatedBooking = await this.bookingRepository.save(booking);
     return {
      customerName: updatedBooking.customerName,
      email: updatedBooking.email,
      gender: updatedBooking.gender,
      phoneNumber: updatedBooking.phoneNumber,
      checkInDate: updatedBooking.checkInDate,
      checkOutDate: updatedBooking.checkOutDate,
      status: updatedBooking.status,
      //room: updatedBooking.room, 
      message: 'Update successful!'
   
    };
  }

  
  async getRelationTest(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['room'] 
    });

    if (!booking) throw new NotFoundException('বুকিং পাওয়া যায়নি');

    
    return {
      bookingId: booking.id,
      customerName: booking.customerName,
      roomId: booking.room ? booking.room.id : 'No Room',
      roomName: booking.room ? booking.room.name : 'N/A',
      //message: 'Relation success!',
      price: booking.room ? booking.room.price : 0
    };
  }

  async cancelBooking(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    
    await this.bookingRepository.delete(id);
    return { message: 'Booking cancelled successfully' };
  }

  async getBookingHistory() {
    return await this.bookingRepository.find({ relations: ['room'] });
  }


  

  async createReview(dto: any) {
    const booking = await this.bookingRepository.findOne({ 
      where: { id: dto.bookingId }, 
      relations: ['review'] 
    });
    
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.review) throw new ConflictException('This booking has already been reviewed');
    
    const review = this.reviewRepository.create({ ...dto, booking });
    return await this.reviewRepository.save(review);
  }
}