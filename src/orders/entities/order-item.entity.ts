import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/enities/core.entity";
import { Dish, DishChoice, DishOption } from "src/restaurants/enities/dish.entities";
import { Column, Entity, ManyToOne } from "typeorm";


@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
    @Field(type => String)
    name: string

    // @Field(type => DishChoice, { nullable: true })
    // choice?: DishChoice
    @Field(type => String, { nullable: true })
    choice?: String

    // @Field(type => Int, { nullable: true })
    // extra?: number
}




@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
    @Field(type => Dish)
    @ManyToOne(type => Dish, { nullable: true, onDelete: 'CASCADE' })
    dish: Dish

    @Field(type => [OrderItemOption], { nullable: true })
    @Column({ type: "json", nullable: true})
    options?: OrderItemOption[]
}