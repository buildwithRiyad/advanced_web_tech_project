import { Controller, Get, Post, Delete, Patch, Put, Param, Body, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerService } from './customer.service';
import { AuthService } from '../auth/auth.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService, private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: any) { return await this.customerService.signUp(dto); }

  @Post('login')
  async login(@Body() dto: any) { return await this.authService.login(dto); }

  // 1. প্রোফাইল গেট করার জন্য (কোনো প্যারামিটার লাগবে না, টোকেন থেকে নাম নিবে)
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req: any) {
    // req.user এ লগইন করা ইউজারের ডেটা থাকে যা AuthGuard প্রোভাইড করে
    return await this.customerService.getProfile(req.user.username);
  }

  // 2. প্রোফাইল আপডেট করার জন্য (বডি থেকে কারেন্ট ইউজারনেম পাস করার ঝামেলা শেষ)
  @Put('profile/update')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req: any, @Body() dto: { newUsername: string, phone?: string }) {
    // টোকেন থেকে কারেন্ট ইউজারনেম এবং বডি থেকে নতুন ডেটা নিয়ে সার্ভিসে পাঠানো হচ্ছে
    const updateDto = {
      currentUsername: req.user.username,
      newUsername: dto.newUsername,
      phone: dto.phone
    };
    return await this.customerService.updateProfile(updateDto);
  }

  @Post('bookings')
  @UseGuards(AuthGuard('jwt'))
  async bookRoom(@Body() dto: CreateBookingDto) { return await this.customerService.createBooking(dto); }

  @Get('rooms')
  async getRooms(@Query('price') price?: string) { return await this.customerService.getRoomsByExactPrice(price ? parseInt(price) : undefined); }

  @Get('bookings')
  @UseGuards(AuthGuard('jwt'))
  async getAllBookings() { return await this.customerService.getBookingHistory(); }

  @Get('bookings/:id')
  @UseGuards(AuthGuard('jwt'))
  async getBookingById(@Param('id', ParseIntPipe) id: number) { return await this.customerService.getBookingById(id); }

  @Patch('bookings/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateBooking(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookingDto) { 
    return await this.customerService.updateBooking(id, dto); 
  }

  @Delete('bookings/:id')
  @UseGuards(AuthGuard('jwt'))
  async cancelBooking(@Param('id', ParseIntPipe) id: number) { return await this.customerService.cancelBooking(id); }

  @Post('reviews')
  @UseGuards(AuthGuard('jwt'))
  async createReview(@Body() reviewDto: CreateReviewDto) { return await this.customerService.createReview(reviewDto); }
}