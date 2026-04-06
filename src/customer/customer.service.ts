import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Room } from './entities/room.entity';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  // --- Rooms Section ---

  async createRoom(dto: { name: string; price: number }) {
    const newRoom = this.roomRepository.create(dto);
    const savedRoom = await this.roomRepository.save(newRoom);
    return { success: true, message: 'Room created successfully', data: savedRoom };
  }

  async getRoomsByExactPrice(price?: number) {
    const whereCondition = price !== undefined ? { price } : {};
    const filtered = await this.roomRepository.find({ 
      where: whereCondition,
      relations: ['bookings'] 
    });
    return { success: true, data: filtered };
  }

  async getRoomById(id: number) {
    const room = await this.roomRepository.findOne({ 
      where: { id },
      relations: ['bookings', 'bookings.review'] // রুমের ভেতর বুকিং এবং বুকিংয়ের রিভিউও দেখা যাবে
    });
    
    return room 
      ? { success: true, data: room }
      : { success: false, message: 'Room not found' };
  }

  // --- Bookings Section ---

  async createBooking(dto: any) {
    const { roomId, checkInDate, checkOutDate, ...bookingDetails } = dto;
    
    // ১. চেক করা যে রুমটি ডাটাবেসে আছে কি না
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) return { success: false, message: 'Room not found' };

    // ২. ডাবল বুকিং চেক (Date Overlap Validation)
    // এটি চেক করবে ওই রুমে ওই সময়ে অন্য কোনো বুকিং 'Booked' বা 'Paid' অবস্থায় আছে কি না
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        room: { id: roomId },
        status: 'Booked', // অথবা 'Paid'
        checkInDate: LessThanOrEqual(checkOutDate),
        checkOutDate: MoreThanOrEqual(checkInDate),
      },
    });

    if (existingBooking) {
      return { 
        success: false, 
        message: 'Sorry, this room is already booked for the selected dates!' 
      };
    }

    // ৩. বুকিং তৈরি করা
    const booking = this.bookingRepository.create({ 
      ...bookingDetails, 
      checkInDate,
      checkOutDate,
      room: room, 
      status: 'Booked' 
    });

    const savedBooking = await this.bookingRepository.save(booking);
    return { 
      success: true, 
      message: 'Room booked successfully',
      data: savedBooking 
    };
  }

  async updateBooking(id: number, dto: any) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) return { success: false, message: 'Booking not found' };

    Object.assign(booking, dto); 
    await this.bookingRepository.save(booking);
    return { success: true, message: 'Booking updated', data: booking };
  }

  async cancelBooking(id: number) {
    // সরাসরি ডিলিট করলে রিলেটেড রিভিউ CASCADE ডিলিট হবে (এনটিটি কনফিগ অনুযায়ী)
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) return { success: false, message: 'Booking not found' };
    return { success: true, message: 'Booking deleted successfully' };
  }

  async getBookingHistory() {
    // বুকিংয়ের সাথে রুম এবং রিভিউ দুটোই দেখার জন্য রিলেশন লোড করা হয়েছে
    const allBookings = await this.bookingRepository.find({ 
      relations: ['room', 'review'] 
    });
    return { success: true, data: allBookings };
  }

  async makePayment(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) return { success: false, message: 'Booking not found' };

    booking.status = 'Paid';
    await this.bookingRepository.save(booking);
    return { success: true, message: 'Payment Successful' };
  }

  // --- Reviews Section ---

  async createReview(dto: CreateReviewDto) {
    const { bookingId, ...reviewData } = dto;

    // বুকিং চেক করা
    const booking = await this.bookingRepository.findOne({ 
      where: { id: bookingId },
      relations: ['review'] // আগে রিভিউ আছে কি না দেখার জন্য
    });

    if (!booking) return { success: false, message: 'Booking not found' };

    // যেহেতু One-to-One, তাই চেক করা যে অলরেডি রিভিউ দেওয়া হয়েছে কি না mehedi shakib
    if (booking.review) {
      return { success: false, message: 'A review already exists for this booking!' };
    }

    const newReview = this.reviewRepository.create({
      ...reviewData,
      booking: booking,
    });

    const savedReview = await this.reviewRepository.save(newReview);
    return { success: true, message: 'Review added successfully', data: savedReview };
  }
}