// src/receptionist/dto/receptionist.dto.ts

import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, Min, MinLength, IsIn, IsOptional, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name must not contain special characters' })
  guestName: string;

  @IsNotEmpty()
  @IsString()
  roomType: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { message: 'roomNumber must be a valid number' })
  roomNumber: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  checkInDate: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  checkOutDate?: string;

  @Matches(/^01[0-9]{9}$/, { message: 'Phone number must start with 01 and be 11 digits' })
  contactNumber: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  password: string;

  @IsOptional()
  @IsString()
  nidFileName?: string;

  
}
export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name must not contain special characters' })
  guestName?: string;

  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @Type(() => Number) // এই লাইনটি স্ট্রিং "202" কে নাম্বার 202 এ কনভার্ট করবে
  @IsNumber({}, { message: 'roomNumber must be a valid number' })
  roomNumber?: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  checkInDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  checkOutDate?: string;

  @IsOptional()
  @Matches(/^01[0-9]{9}$/, { message: 'Phone number must start with 01 and be 11 digits' })
  contactNumber?: string;

  @IsOptional()
  @IsString()
  nidFileName?: string;
}

export class PaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Amount must be a positive number' }) 
  amount: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['Cash', 'Card', 'Bkash', 'Nagad'], { message: 'Payment method must be Cash, Card, Bkash or Nagad' })
  paymentMethod: string; 

  @IsNotEmpty()
  @IsString()
  @IsIn(['Paid', 'Pending', 'Partial'], { message: 'Status must be Paid, Pending or Partial' })
  status: string;
}

export class ComplaintDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Guest name must not contain special characters' })
  guestName: string;

  @IsNotEmpty()
  @IsNumber()
  roomNumber: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Issue description should be at least 10 characters long' }) 
  description: string;

  @IsOptional()
  @IsString()
  @IsIn(['Low', 'Medium', 'High'], { message: 'Priority must be Low, Medium or High' })
  priority?: string; 
}