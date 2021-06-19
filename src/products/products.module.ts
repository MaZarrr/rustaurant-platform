import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductOrderController } from './products.controller';
import { ProductOrderService } from './products.service';
import { Product, ProductOrderShema } from './shemas/products.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductOrderShema }])],
    controllers: [ProductOrderController],
    providers: [ProductOrderService]
})
export class ProductOrderModule {}