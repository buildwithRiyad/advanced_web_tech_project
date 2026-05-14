import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Booking } from './entities/booking.entity';
import { Room } from './entities/room.entity';
import { Review } from './entities/review.entity';
import { User } from './entities/user.entity'; 
import { CreateBookingDto } from './dto/create-booking.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { PusherService } from '../pusher.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly pusherService: PusherService,
  ) {}

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // --- Profile Update Method ---
  async updateProfile(dto: { currentUsername: string, newUsername: string, phone?: string }) {
    const user = await this.userRepository.findOne({ where: { username: dto.currentUsername } });

    if (!user) {
      throw new NotFoundException(`User with username ${dto.currentUsername} not found!`);
    }

    if (dto.newUsername !== dto.currentUsername) {
      const existing = await this.userRepository.findOne({ where: { username: dto.newUsername } });
      if (existing) throw new ConflictException('New username is already taken!');
    }

    user.username = dto.newUsername;
    if (dto.phone) {
      (user as any).phone = dto.phone; 
    }

    await this.userRepository.save(user);

    return {
      message: 'Profile updated successfully',
      updatedUser: {
        username: user.username,
        phone: (user as any).phone
      }
    };
  }

  // --- SignUp Method ---
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

  // --- Booking Methods ---
  async createBooking(dto: CreateBookingDto) {
    const room = await this.roomRepository.findOne({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    const checkIn = this.parseDate(dto.checkInDate);
    const checkOut = this.parseDate(dto.checkOutDate);

    const overlapping = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId: dto.roomId })
      .andWhere('(booking.checkInDate < :checkOutDate AND booking.checkOutDate > :checkInDate)', { checkInDate: checkIn, checkOutDate: checkOut })
      .getOne();

    if (overlapping) throw new ConflictException('Room already booked for these dates.');

    const booking = this.bookingRepository.create({ 
        ...dto, 
        checkInDate: checkIn, 
        checkOutDate: checkOut, 
        room, 
        status: 'Booked' 
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // --- PUSHER UPDATED LOGIC ---
    try {
        await this.pusherService.trigger('hotel-royal-channel', 'booking-update', { 
            message: `New booking for Room #${dto.roomId}`, 
            customer: dto.customerName,
            price: room.price,
            time: new Date().toLocaleTimeString()
        });
        console.log('✅ Pusher notification sent successfully');
    } catch (error) {
        console.error('❌ Pusher notification failed:', error);
        // বুকিং সেভ হয়ে গেছে, তাই এখানে এরর থ্রো করব না যাতে ইউজার ইন্টারাপ্ট না হয়
    }

    return savedBooking;
  }

  async getBookingHistory() { return await this.bookingRepository.find({ relations: ['room'] }); }

  async getBookingById(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id }, relations: ['room'] });
    if (!booking) throw new NotFoundException(`Booking ID ${id} not found`);
    return booking;
  }

  async updateBooking(id: number, dto: any) {
    const booking = await this.getBookingById(id);
    Object.assign(booking, dto);
    return await this.bookingRepository.save(booking);
  }

  async cancelBooking(id: number) {
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Booking not found');
    return { message: 'Booking cancelled successfully' };
  }

  async createReview(dto: any) {
    const review = this.reviewRepository.create(dto);
    return await this.reviewRepository.save(review);
  }

  async getRoomsByExactPrice(price?: number) { return await this.roomRepository.find({ where: price ? { price } : {} }); }

  async createRoom(dto: any) { return await this.roomRepository.save(this.roomRepository.create(dto)); }

  async getRelationTest(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
}