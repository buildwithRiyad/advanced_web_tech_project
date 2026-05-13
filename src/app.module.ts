import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { PusherService } from './pusher.service'; // Pusher service import করলাম

@Global() // Global করার ফলে অন্য মডিউলে বারবার ইমপোর্ট করতে হবে না
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
          user: 'shakibfakir6796@gmail.com',
          pass: 'fuwm fyvc jdfz dydm',
        },
      },
      defaults: {
        from: '"Hotel Management" <shakibfakir6796@gmail.com>',
      },
    }),

    CustomerModule,
    AuthModule,
  ],
  providers: [PusherService], // PusherService এখানে রেজিস্টার করলাম
  exports: [PusherService],   // যাতে অন্য সার্ভিস বা কন্ট্রোলার এটি ব্যবহার করতে পারে
})
export class AppModule {}