import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/enities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/enities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Category } from './category.enities';
import { Dish } from './dish.entities';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(3)
  name: string;

  @Field(type => String)
  @Column()
  @IsString()
  coverImage: string;

  // @Field((type) => String, { defaultValue: 'Не указан' })
  @Field((type) => String)
  @Column()
  address: string;

  @Field(type => Category, { nullable: true })
  @ManyToOne(type => Category, category => category.restaurants, { nullable: true, onDelete: 'SET NULL'})
  category: Category

  @Field(type => Boolean)
  @Column()
  @IsBoolean()
  isOnlinePay: boolean;

  @Field(type => User)
  @ManyToOne(
    type => User, 
    user => user.restaurants,
    { onDelete: 'CASCADE' }
  )
  owner: User

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field(type => [Order])
  @OneToMany(type => Order, order => order.restaurant)
  orders: Order[];

  @Field(type => [Dish])
  @OneToMany(
      type => Dish, 
      dish => dish.restaurant
    )
    menu: Dish[]

    @Field((type) => Boolean) // продвигать
    @Column({ default: false })
    isPromoted: boolean;

    @Field(type => Date, { nullable: true}) //продвигается до
    @Column({ nullable: true})
    promotedUntil: Date;

}
