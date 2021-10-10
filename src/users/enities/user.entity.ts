import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/enities/core.entity';
import * as bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { Restaurant } from 'src/restaurants/enities/restaurant.enities';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payments.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery'
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsPhoneNumber()
  phone: string;

  @Column({ select: false, nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  password?: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;
  // email или телефон при регистрации // !!!

  @Field(type => [Restaurant])
  @OneToMany(type => Restaurant, restaurant => restaurant.owner)
  restaurants: Restaurant[]

  @Field(type => [Order])
  @OneToMany(type => Order, order => order.customer)
  orders: Order[]

  @Field(type => [Payment])
  @OneToMany(type => Payment, payment => payment.user, { eager: true })
  payments: Payment[]

  @Field(type => [Order])
  @OneToMany(type => Order, order => order.driver)
  rides: Order[] // ездить

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkCodePassword(code: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(code, this.password);
      return ok;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
