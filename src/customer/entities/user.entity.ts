import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') 
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true }) 
  username!: string;

  @Column()
  password?: string; 

  @Column({ default: 'customer' }) 
  role!: string;

  
  @Column({ nullable: true })
  accessToken?: string; 
}