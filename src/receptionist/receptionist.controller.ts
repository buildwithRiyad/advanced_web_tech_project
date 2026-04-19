// src/receptionist/receptionist.controller.ts

import { 
  Controller, Get, Put, Post, Patch, Delete, Body, Param, 
  UsePipes, ValidationPipe, UseInterceptors, UploadedFile, 
  BadRequestException, UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceptionistService } from './receptionist.service';
import { CreateBookingDto, UpdateBookingDto, PaymentDto, ComplaintDto } from './dto/receptionist.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('receptionist')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class ReceptionistController {
  constructor(private readonly receptionistService: ReceptionistService) {}

  @Post('signup')
  signup(@Body() data: { name: string; email: string; password: string }) {
    return this.receptionistService.createReceptionist(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('add-booking/:resId')
  @UseInterceptors(FileInterceptor('nidFileName')) 
  addBooking(
    @UploadedFile() file: Express.Multer.File, 
    @Body() dto: CreateBookingDto, 
    @Param('resId', ParseIntPipe) resId: number
  ) {
    if (!file) {
      throw new BadRequestException('NID file is mandatory for guest booking!');
    }

    if (!file.originalname.match(/\.(pdf)$/)) {
      throw new BadRequestException('Invalid file format! Only PDF files are allowed.');
    }

    dto.nidFileName = file.originalname; 

    return this.receptionistService.createBooking(dto, resId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Post('record-payment/:bookingId')
  recordPayment(@Body() dto: PaymentDto, @Param('bookingId', ParseIntPipe) bookingId: number) {
    return this.receptionistService.postPayment(dto, bookingId);
  }

  
  @UseGuards(AuthGuard('jwt'))
  @Get('generate-bill/:bookingId')
  generateBill(@Param('bookingId', ParseIntPipe) bookingId: number) {
    return this.receptionistService.getBill(bookingId);
  }

 
  @UseGuards(AuthGuard('jwt'))
  @Post('complaint/:resId')
  handleComplaint(@Body() dto: ComplaintDto, @Param('resId', ParseIntPipe) resId: number) {
    return this.receptionistService.saveComplaint(dto, resId);
  }

  // --- Standard CRUD Routes ---

  @UseGuards(AuthGuard('jwt'))
  @Get('view-bookings')
  viewBookings() {
    return this.receptionistService.getAllBookings();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('view-booking/:id')
  viewOneBooking(@Param('id', ParseIntPipe) id: number) {
    return this.receptionistService.getBookingById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-booking-full/:id') 
  @UseInterceptors(FileInterceptor('nidFileName'))
  replaceBooking(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: CreateBookingDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      dto.nidFileName = file.originalname;
    }
    return this.receptionistService.updateBooking(id, dto as any);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-booking/:id') 
  @UseInterceptors(FileInterceptor('nidFile'))
  updateBooking(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateBookingDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      dto.nidFileName = file.originalname;
    }
    return this.receptionistService.updateBooking(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete-booking/:id')
  deleteBooking(@Param('id', ParseIntPipe) id: number) {
    return this.receptionistService.deleteBooking(id);
  }

  // --- Relationship Based Routes ---

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-booking-payment/:bookingId')
  updateBookingPayment(
    @Param('bookingId', ParseIntPipe) bookingId: number, 
    @Body() dto: PaymentDto
  ) {
    return this.receptionistService.updatePaymentByBooking(bookingId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-booking-receptionist/:bookingId/:newResId')
  updateBookingReceptionist(
    @Param('bookingId', ParseIntPipe) bookingId: number, 
    @Param('newResId', ParseIntPipe) newResId: number
  ) {
    return this.receptionistService.changeBookingReceptionist(bookingId, newResId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('view-my-bookings/:resId')
  getMyBookings(@Param('resId', ParseIntPipe) resId: number) {
    return this.receptionistService.getBookingsByReceptionist(resId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('clear-my-complaints/:resId')
  clearComplaints(@Param('resId', ParseIntPipe) resId: number) {
    return this.receptionistService.deleteComplaintsByReceptionist(resId);
  }
}