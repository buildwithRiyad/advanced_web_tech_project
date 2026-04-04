import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
// Spelling check: 'customer' folder-er namer sathe milte hobe
import { CustomerService } from './customer/customer.service'; 

@Module({
  imports: [CustomerModule],
  controllers: [AppController],
  providers: [AppService], // Ekhane CustomerService pathanor dorkar nei jodi module-e thake
})
export class AppModule {}