import { Products } from '../shemas/products.schema';

export class CreateProductDto {
  product: Array<Products>;
  deliveryType: string;
  dateDelivery?: string;
  timeDelivery?: string;
  adress?: string;
  street?: string;
  home?: number;
  totalPrice: number;
}
