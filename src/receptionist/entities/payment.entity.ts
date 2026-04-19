// src/receptionist/entities/payment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { Booking } from './booking.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  status: string;

  @Column()
  paymentMethod: string; 

  @CreateDateColumn()
  paymentDate: Date;

  // Inverse side of One-to-One relationship
  @OneToOne(() => Booking, (booking) => booking.payment)
  booking: Booking;
}