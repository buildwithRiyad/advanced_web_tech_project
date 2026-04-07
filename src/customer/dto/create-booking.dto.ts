import {
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name can only contain letters and spaces' })
  customerName!: string;

  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
    message: 'Email must be a gmail.com address',
  })
  email!: string;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(['Male', 'Female'], { message: 'Gender must be Male or Female' })
  gender!: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @Matches(/^[0-9]{7,15}$/, { message: 'Phone number must contain 7 to 15 digits' })
  phoneNumber!: string;

  @IsNotEmpty({ message: 'Room ID is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Room ID must be a number' })
  roomId!: number;

  @IsNotEmpty({ message: 'Check-in date is required' })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
    message: 'Check-in date format must be DD-MM-YYYY',
  })
  checkInDate!: string;

  @IsNotEmpty({ message: 'Check-out date is required' })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
    message: 'Check-out date format must be DD-MM-YYYY',
  })
  checkOutDate!: string;
}