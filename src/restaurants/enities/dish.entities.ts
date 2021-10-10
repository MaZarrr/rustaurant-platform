import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/enities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Restaurant } from "./restaurant.enities";

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
    @Field(type => String)
    name: string
    @Field(type => Int, {nullable: true})
    extra?: number
}


@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
    @Field(type => String)
    name: string

    @Field(type => [DishChoice], {nullable: true})
    choices?: DishChoice[] // выбор, подбор, лакомый кусок

    @Field(type => Int, { nullable: true })
    extra?: number; // дополнительный
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {

  @Field((type) => String)
  @Column()
  // @Column({ unique: true })
  @IsString()
  @Length(3)
  name: string;

  @Field(type => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(type => String, {nullable: true})
  @Column({nullable: true})
  @IsString()
  photo: string;

  @Field(type => String)
  @Column()
  @Length(5, 140)
  description: string;

  @Field(type => Restaurant)
  @ManyToOne(
      type => Restaurant, 
      restaurant => restaurant.menu, 
      { onDelete: 'CASCADE'}
    )
    restaurant: Restaurant

    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;

    @Field(type => [DishOption], { nullable: true })
    @Column({ type: "json", nullable: true})
    options?: DishOption[]
}