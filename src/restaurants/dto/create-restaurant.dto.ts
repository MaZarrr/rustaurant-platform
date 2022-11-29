import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Restaurant } from '../enities/restaurant.enities';

// @ArgsType()
@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
    'name', 
    'coverImage',
    'address',
    'isOnlinePay'
]) {
    @Field(type => String)
    categoryName: string;

}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}