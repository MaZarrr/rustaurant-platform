import { Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Category } from "../enities/category.enities";

@ObjectType()
export class AllCategoriesOutput extends CoreOutput{

    @Field(type => [Category], {nullable: true})
    categories?: Category[]
}