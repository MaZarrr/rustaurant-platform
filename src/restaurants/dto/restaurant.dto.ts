import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Restaurant } from "../enities/restaurant.enities";
// RestaurantInputModule такое название из за commons такое же название RestaurantInput
@InputType()
export class RestaurantInput {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends CoreOutput {
    @Field(type => Restaurant, {nullable: true})
    restaurant?: Restaurant;
}