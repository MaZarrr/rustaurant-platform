// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import { CreateProductDto } from 'src/products/dto/create-product.dto';

// export type UserDocument = User & Document

// type Products = {
//     name: string
//     description?: string
//     optionProduct?: string
//     count: number
//     price: number
// }

// type Order = {
//     product: Array<Products>
//     deliveryType: string
//     dateDelivery?: string
//     timeDelivery?: string
//     adress?: string
//     street?: string
//     home?: number
//     totalPrice: number
// }

// @Schema()
// export class User {
//     @Prop({ type: String })
//     userId: string

//     @Prop()
//     username: string

//     @Prop()
//     age: number

//     @Prop()
//     password: string

//     @Prop()
//     isActivated: boolean

//     @Prop()
//     orders: Array<Products>

//     @Prop()
//     token: string

//     // @Prop({ required: true, unique: true })
//     @Prop({ required: true })
//     phone: number

//     // @Prop()
//     // orderList?: Array<CreateProductDto>

//     @Prop()
//     timestamp: Date
// }

// export const UserShema = SchemaFactory.createForClass(User)
