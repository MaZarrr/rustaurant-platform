import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TokenDocument = Token & Document

@Schema()
export class Token {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop( { required: true } )
    refreshToken: string;
}

export const TokenShema = SchemaFactory.createForClass(Token)