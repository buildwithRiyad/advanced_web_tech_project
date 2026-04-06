import {
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  Matches,
  MinLength,
} 
from 'class-validator';
import { Type } from 'class-transformer';


export class CreateBookingDto {

@IsString()
@Matches(/^[A-Za-z\s]+$/, 
    { message: 'Name can only contain letters and spaces' })
customerName!: string;


@IsEmail({}, 
  { message: 'Email must be a valid email address' })
@Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
  message: 'Email must be a gmail.com address',
})
email!: string;


@IsEnum(['Male', 'Female'], 
  { message: 'Invalid Gender' })
gender!: string;



 @IsString(
  { message: 'Phone number must be a required' })
@Matches(/^[0-9]{7,15}$/, {
  message: 'Phone number must contain only digits',
})
phoneNumber!: string;


 @Type(() => Number)
@IsNumber({}, 
  { message: 'Room ID must be only number' })
roomId!: number;

 
@Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
  message: 'Please enter a valid checkin date format',
})
checkInDate!: string;



@Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
  message: 'Please enter a valid checkout date format',
})
checkOutDate!: string;

}