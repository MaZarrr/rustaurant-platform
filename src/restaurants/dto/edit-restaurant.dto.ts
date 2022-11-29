import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Restaurant } from "../enities/restaurant.enities";
import { CreateRestaurantInput } from "./create-restaurant.dto";


@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput){
    @Field(type => Number)
    restaurantId: number;
} 
 
@ObjectType()
export class EditRestaurantOutput extends CoreOutput{
    @Field(type => Boolean, { nullable: true })
    isOnlinePay?: boolean 
}