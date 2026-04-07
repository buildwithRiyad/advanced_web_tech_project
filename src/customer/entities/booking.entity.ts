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

 
  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'CASCADE' })
  room!: Room;

  
  @OneToOne(() => Review, (review) => review.booking)
  review!: Review;

 @Column({ type: 'date' })
checkInDate!: Date;

  @Column()
  checkOutDate!: Date;

  @Column({ default: 'Booked' }) 
  status!: string; 
}