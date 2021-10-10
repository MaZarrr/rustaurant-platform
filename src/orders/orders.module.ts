import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/enities/dish.entities';
import { Restaurant } from 'src/restaurants/enities/restaurant.enities';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';

@Module({
    imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
    providers: [
        OrderService,
        OrderResolver
    ]
})
export class OrdersModule {}
