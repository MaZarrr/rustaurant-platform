import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TokenDocument = Token & Document

@Schema()
export class Token {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    user: mongoose.Types.ObjectId;
    // @Prop({ ref: 'User' })

    @Prop()
    refreshToken: string;
}

export const TokenShema = SchemaFactory.createForClass(Token)