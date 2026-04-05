import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { PartialBookingDto } from './dto/partial-booking.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

 
  @Post('create-room')
  @UsePipes(new ValidationPipe({ transform: true }))
  createRoom(@Body() roomDto: { name: string; price: number }) {
    return this.customerService.createRoom(roomDto);
  }

  @Get('rooms')
  getRooms(@Query('price') price?: string) {
    const parsedPrice = price ? parseInt(price) : undefined;
    return this.customerService.getRoomsByExactPrice(parsedPrice);
  }

  @Get('rooms/:id')
  getRoom(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.getRoomById(id);
  }

  
  @Post('bookings')
  @UsePipes(new ValidationPipe({ transform: true }))
  bookRoom(@Body() dto: CreateBookingDto) {
    return this.customerService.createBooking(dto);
  }

 
  @Put('bookings/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  editBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.customerService.updateBooking(id, dto);
  }


  @Delete('bookings/:id')
  cancelBooking(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.cancelBooking(id);
  }


  @Get('bookings')
  bookingHistory() {
    return this.customerService.getBookingHistory();
  }

  @Patch('bookings/:id/payment')
  makePayment(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.makePayment(id);
  }


  @Post('reviews')
  @UsePipes(new ValidationPipe({ transform: true }))
  createReview(@Body() reviewDto: CreateReviewDto) {
    return this.customerService.createReview(reviewDto);
  }

  
  @Post('validation-check')
  @UsePipes(new ValidationPipe({ transform: true }))
  validateField(@Body() dto: PartialBookingDto) {
    return {
      success: true,
      message: 'Validation successful',
      data: dto,
    };
  }
}