import { IsString, IsNumber, Max, Min, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  
  @IsString({ message: 'Customer name must be a string' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name can only contain letters and spaces' })
  customerName!: string;

  /**
   * এখানে roomId-এর পরিবর্তে bookingId যোগ করা হয়েছে।
   * কারণ প্রতিটি রিভিউ একটি নির্দিষ্ট বুকিংয়ের আন্ডারে থাকবে।
   */
  @Type(() => Number)
  @IsNumber({}, { message: 'Booking ID must be a number' })
  @IsNotEmpty({ message: 'Booking ID is required' })
  bookingId!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating cannot be less than 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating!: number;

  @IsString({ message: 'Comment must be a string' })
  // আপনার আগের Regex-এ যদি বাংলা সাপোর্ট না করে, তবে নিচেরটি ব্যবহার করতে পারেন অথবা আপাতত সরাতে পারেন
  @Matches(/^[\w\s.,!?'-]+$/, { 
    message: 'Comment can only contain letters, numbers and punctuation' 
  })
  comment!: string;
}