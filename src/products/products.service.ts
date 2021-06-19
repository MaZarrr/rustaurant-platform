import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./shemas/products.schema";

@Injectable()
export class ProductOrderService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>){}
}