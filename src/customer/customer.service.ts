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
import axios from 'axios'; // 🌟 Pusher Beams API হিট করার জন্য Axios ইম্পোর্ট করা হয়েছে

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

  // 🚀 Pusher Beams API ফায়ারিং মেথড
  private async sendBeamsNotification(title: string, body: string) {
    const instanceId = '14a93161-ec71-4fc7-8525-b8deae1f33be'; // 🌟 আপনার অরিজিনাল বিমস আইডি
    const secretKey = '1DDFAD21BFBD042E1C56227D55F04241D99816D53606382605A382B47EF356BC'; // 🌟 আপনার অরিজিনাল সিক্রেট কি

    try {
      await axios.post(
        `https://${instanceId}.pushnotifications.pusher.com/publish_api/v1/instances/${instanceId}/publishes`,
        {
          interests: ['global'],
          web: {
            notification: {
              title: title,
              body: body,
              deep_link: 'http://localhost:3001/my-bookings',
              icon: 'https://pusher.com/static/images/logo.png',
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      console.log(`✅ Pusher Beams: "${title}" নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!`);
    } catch (error: any) {
      console.error('❌ Pusher Beams Error:', error.response?.data || error.message);
    }
  }

  // --- Profile Methods ---
  async getProfile(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found!`);
    }
    
    return {
      username: user.username,
      email: (user as any).email || `${user.username}@gmail.com`, 
      phone: (user as any).phone || "Not Set",
      role: user.role || 'customer'
    };
  }

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

    // 🔔 Pusher Beams লাইভ নোটিফিকেশন ফায়ার (বুকিং সাকসেস - সম্পূর্ণ ফিক্সড এবং সেফ করা হয়েছে)
    try {
      const roomName = room.name || `Room #${dto.roomId}`;
      const customer = (dto as any).customerName || dto.email || 'A Guest';
      
      await this.sendBeamsNotification(
        'New Booking Confirmed! 🏨',
        `${roomName} has been booked successfully by ${customer}.`
      );
    } catch (pushError) {
      console.error('⚠️ Pusher Beams bypassed in createBooking:', pushError);
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
    const booking = await this.bookingRepository.findOne({ where: { id }, relations: ['room'] });
    if (!booking) throw new NotFoundException('Booking not found');
    const roomId = booking.room?.id || id;
    const roomName = booking.room?.name || `Room #${roomId}`;

    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Booking not found');

    // 🔔 Pusher Beams লাইভ নোটিফিকেশন ফায়ার (বুকিং ক্যানসেল)
    try {
      await this.sendBeamsNotification(
        'Booking Cancelled! ❌',
        `The reservation for ${roomName} has been successfully cancelled.`
      );
    } catch (pushError) {
      console.error('⚠️ Pusher Beams bypassed in cancelBooking:', pushError);
    }

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