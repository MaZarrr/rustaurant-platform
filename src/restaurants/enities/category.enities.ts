import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/enities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.enities';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  @Length(3)
  name: string;

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field(type => String)
  @Column({ unique: true })
  @IsString() 
  slug: string;

  @Field(type => [Restaurant])
  @OneToMany(type => Restaurant, restaurant => restaurant.category)
  restaurants: Restaurant[]

}
