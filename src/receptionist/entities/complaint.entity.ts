// src/receptionist/entities/complaint.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Receptionist } from './receptionist.entity'; 

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guestName: string;

  @Column()
  roomNumber: number;

  @Column('text')
  issue: string; 

  @Column({ nullable: true })
  priority: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Receptionist, (receptionist) => receptionist.complaints)
  receptionist: Receptionist;
}