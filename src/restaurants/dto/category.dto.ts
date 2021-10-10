import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dto/pagination.dto";
import { Category } from "../enities/category.enities";

@InputType()
export class CategoryInput extends PaginationInput {
    @Field(type => String)
    slug: string
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
    @Field(type => Category, { nullable: true })
    category?: Category; 
}