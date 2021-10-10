import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Restaurant } from "src/restaurants/enities/restaurant.enities";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class RestaurantsInput extends PaginationInput{}

@ObjectType()
export class RestaurantsOutput extends PaginationOutput{
    @Field(type => [Restaurant], { nullable: true })
    results?: Array<Restaurant>; //Restaurant[]
}