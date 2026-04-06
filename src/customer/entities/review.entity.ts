import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  // roomId আলাদাভাবে রাখার প্রয়োজন নেই, কারণ বুকিংয়ের মাধ্যমেই রুম পাওয়া যাবে
  @Column({ nullable: true })
  roomId!: number;

  @Column()
  rating!: number;

  @Column()
  comment!: string;

  // One-to-One: এই রিভিউটি কোন বুকিংয়ের জন্য?
  // এখানে CASCADE যোগ করা হয়েছে যাতে বুকিং ডিলিট হলে রিভিউ মুছে যায়
  @OneToOne(() => Booking, (booking) => booking.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' }) // রিভিউ টেবিলে bookingId কলাম তৈরি হবে
  booking!: Booking;
}