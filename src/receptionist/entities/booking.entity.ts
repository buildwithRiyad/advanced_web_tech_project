// src/receptionist/entities/booking.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Receptionist } from './receptionist.entity';
import { Payment } from './payment.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guestName: string;

  @Column()
  roomType: string;

  @Column({ nullable: true })
  roomNumber: number;

  @Column()
  checkInDate: string;

  @Column({ nullable: true })
  checkOutDate: string;

  @Column()
  contactNumber: string;

  @Column()
  password: string; 

  @Column()
  nidFileName: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Receptionist, (receptionist) => receptionist.bookings)
  receptionist: Receptionist;

  // Each booking has exactly one payment record (One-to-One)
  @OneToOne(() => Payment, (payment) => payment.booking)
  @JoinColumn() 
  payment: Payment;
}