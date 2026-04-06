import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne } from 'typeorm';
import { Room } from './room.entity';
import { Review } from './review.entity';

@Entity('bookings') 
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  @Column()
  email!: string;

  @Column()
  gender!: string;

  @Column()
  phoneNumber!: string;

  // Many-to-One: অনেকগুলো বুকিং একটি রুমের হতে পারে
  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'CASCADE' })
  room!: Room;

  // One-to-One: একটি বুকিংয়ের বিপরীতে একটি রিভিউ (Bi-directional)
  @OneToOne(() => Review, (review) => review.booking)
  review!: Review;

  @Column()
  checkInDate!: string;

  @Column()
  checkOutDate!: string;

  @Column({ default: 'Booked' }) 
  status!: string; 
}