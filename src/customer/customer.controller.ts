import { Controller, Get, Post, Delete, Patch, Put, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
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

  @Put('profile/update')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Body() dto: { currentUsername: string, newUsername: string, phone?: string }) {
    return await this.customerService.updateProfile(dto);
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

  @Delete('bookings/:id')
  @UseGuards(AuthGuard('jwt'))
  async cancelBooking(@Param('id', ParseIntPipe) id: number) { return await this.customerService.cancelBooking(id); }

  @Post('reviews')
  @UseGuards(AuthGuard('jwt'))
  async createReview(@Body() reviewDto: CreateReviewDto) { return await this.customerService.createReview(reviewDto); }
}