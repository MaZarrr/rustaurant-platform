import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Order, OrderStatus } from "../entities/order.entity";

@InputType()
export class GetOrdersInputType {
    @Field(type => OrderStatus, {nullable: true})
    status?: OrderStatus
}

@ObjectType()
export class GetOrdersOutput extends CoreOutput {
    @Field(type => [Order], { nullable: true })
    orders?: Order[]
}