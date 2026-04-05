import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'student', 
    database: 'hotel_db',
    autoLoadEntities: true,
    synchronize: true, // এটি অবশ্যই থাকতে হবে
  }),
  CustomerModule,
],
})
export class AppModule {}