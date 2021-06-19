import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({ type: String, required: true })
    userId: string

    @Prop()
    username: string

    @Prop()
    age: number

    @Prop()
    password: string

    @Prop({ required: true, unique: true })
    phone: number

    // @Prop()
    // orderList?: Array<CreateProductDto>

    @Prop()
    timestamp: Date
}

export const UserShema = SchemaFactory.createForClass(User)