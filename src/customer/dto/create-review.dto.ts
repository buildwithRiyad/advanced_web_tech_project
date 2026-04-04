import { IsString, IsNumber, Max, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  
  @IsString(
    { message: 'Customer name must be a string' })
  @Matches(/^[A-Za-z\s]+$/, 
    { message: 'Name can only contain letters and spaces' })
  customerName: string;


  @Type(() => Number)
  @IsNumber({}, 
    { message: 'Room ID must be a number' })
  roomId: number;

 
   @Type(() => Number)
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating cannot be less than 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating: number;

  
  @IsString(
    { message: 'Comment must be a string' })
  @Matches(/^[\w\s.,!?'-]+$/,
     { message: 'Comment can only contain letters, numbers and punctuation' })
  comment: string;
}