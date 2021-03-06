import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/enities/restaurant.enities';
import { Payment } from './entities/payments.entity';
import { PaymentResolver } from './payments.resolver';
import { PaymentService } from './payments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
    providers: [PaymentResolver, PaymentService]
})
export class PaymentsModule {}
