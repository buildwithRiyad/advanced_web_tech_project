// src/receptionist/entities/receptionist.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';
import { Complaint } from './complaint.entity';

@Entity('receptionists')
export class Receptionist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column() 
  password: string;
  
  @OneToMany(() => Booking, (booking) => booking.receptionist)
  bookings: Booking[];

  @OneToMany(() => Complaint, (complaint) => complaint.receptionist)
complaints: Complaint[];
}