import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Put, 
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomerService } from './customer.service';
import { AuthService } from '../auth/auth.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  
  
  @Post('signup')
  async signup(@Body() dto: any) {
    return await this.customerService.signUp(dto);
  }

  
  @Post('login')
  async login(@Body() dto: any) {
    return await this.authService.login(dto);
  }

  
  @Post('bookings')
  @UseGuards(AuthGuard('jwt'))
  async bookRoom(@Body() dto: CreateBookingDto) {
    return await this.customerService.createBooking(dto);
  }

  
  @Get('rooms')
  async getRooms(@Query('price') price?: string) {
    const parsedPrice = price ? parseInt(price) : undefined;
    return await this.customerService.getRoomsByExactPrice(parsedPrice);
  }

 
  @Get('bookings')
  @UseGuards(AuthGuard('jwt'))
  async getAllBookings() {
    return await this.customerService.getBookingHistory();
  }

 
  @Patch('bookings/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateBooking(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookingDto) {
    return await this.customerService.updateBooking(id, dto);
  }

  
  @Put('bookings/:id')
  @UseGuards(AuthGuard('jwt'))
  async replaceBooking(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateBookingDto) {
    return await this.customerService.updateBooking(id, dto);
  }


  @Delete('bookings/:id')
  @UseGuards(AuthGuard('jwt'))
  async cancelBooking(@Param('id', ParseIntPipe) id: number) {
    return await this.customerService.cancelBooking(id);
  }

 
  @Post('reviews')
  @UseGuards(AuthGuard('jwt'))
  async createReview(@Body() reviewDto: CreateReviewDto) {
    return await this.customerService.createReview(reviewDto);
  }
}