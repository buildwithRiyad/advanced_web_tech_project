import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';

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
      synchronize: true, 
    }),

   
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: 'shakibfakir6796@@gmail.com', 
          pass: 'fuwm fyvc jdfz dydm', 
        },
      },
      defaults: {
        from: '"Hotel Management" <your-email@gmail.com>', 
      },
    }),

    CustomerModule,
    AuthModule, 
  ],
})
export class AppModule {}