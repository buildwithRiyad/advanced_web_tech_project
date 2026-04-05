import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings') 
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number; // এখানে ! যোগ করা হয়েছে

  @Column()
  customerName!: string;

  @Column()
  email!: string;

  @Column()
  gender!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  roomId!: number;

  @Column()
  checkInDate!: string;

  @Column()
  checkOutDate!: string;

  @Column({ default: 'Booked' }) 
  status!: string;
}