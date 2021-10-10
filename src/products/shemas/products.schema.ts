import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type Products = {
  name: string;
  description?: string;
  optionProduct?: string;
  count: number;
  price: number;
};

type Order = {
  product: Array<Products>;
  deliveryType: string;
  dateDelivery?: string;
  timeDelivery?: string;
  adress?: string;
  street?: string;
  home?: number;
  totalPrice: number;
};

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  userId: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  orders: Array<Order>;

  @Prop()
  timestamp: Date;
}

export const ProductOrderShema = SchemaFactory.createForClass(Product);
