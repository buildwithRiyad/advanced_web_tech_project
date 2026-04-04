import {
  Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, ParseIntPipe,
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { PartialBookingDto } from './dto/partial-booking.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

 
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
  bookRoom(@Body() dto: CreateBookingDto) {
    return this.customerService.createBooking(dto);
  }

  @Put('bookings/:id')
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
  addReview(@Body() dto: CreateReviewDto) {
    return this.customerService.addReview(dto);
  }

  
 @Post('validation-check')
validateField(@Body() dto: PartialBookingDto) {
  return {
    success: true,
    message: 'Validation successful',
    data: dto,
  };
}
}







