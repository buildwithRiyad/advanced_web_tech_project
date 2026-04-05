import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    if (price !== undefined) {
      const filtered = await this.roomRepository.find({ where: { price } });
      return { success: true, data: filtered };
    }
    const allRooms = await this.roomRepository.find();
    return { success: true, data: allRooms };
  }

  async getRoomById(id: number) {
    const room = await this.roomRepository.findOne({ where: { id } });
    return room 
      ? { success: true, data: room }
      : { success: false, message: 'Room not found' };
  }

  // --- Booking Section ---

  async createBooking(dto: any) {
    const booking = this.bookingRepository.create({ ...dto, status: 'Booked' });
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
    const result = await this.bookingRepository.delete(id);
    if (result.affected === 0) return { success: false, message: 'Booking not found' };
    return { success: true, message: 'Booking cancelled' };
  }

  async getBookingHistory() {
    const allBookings = await this.bookingRepository.find();
    return { success: true, data: allBookings };
  }

  // --- Payment & Review Section ---

  async makePayment(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) return { success: false, message: 'Booking not found' };

    booking.status = 'Paid';
    await this.bookingRepository.save(booking);
    return { success: true, message: 'Payment Successful' };
  }

  async createReview(dto: CreateReviewDto) {
    const newReview = this.reviewRepository.create(dto);
    const savedReview = await this.reviewRepository.save(newReview);
    return { success: true, message: 'Review Added Successfully', data: savedReview };
  }
}