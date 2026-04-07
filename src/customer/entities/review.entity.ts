import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

 
  @Column({ nullable: true })
  roomId!: number;

  @Column()
  rating!: number;

  @Column()
  comment!: string;

 
  @OneToOne(() => Booking, (booking) => booking.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' }) 
  booking!: Booking;
}