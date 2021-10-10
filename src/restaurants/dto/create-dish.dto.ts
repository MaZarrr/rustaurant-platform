import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Dish } from "../enities/dish.entities";

@InputType()
export class CreateDishInput extends PickType(Dish, [
    'name',
    'price',
    'description',
    'options'
]) {
    @Field(type => Int)
    restaurantId: number;
}


@ObjectType()
export class CreateDishOutput extends CoreOutput {}