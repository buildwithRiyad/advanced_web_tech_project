import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  price!: number;

  // একটি রুমের অনেকগুলো বুকিং থাকতে পারে
  @OneToMany(() => Booking, (booking) => booking.room)
  bookings!: Booking[];
}