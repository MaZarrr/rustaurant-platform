import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductOrderModule } from 'src/products/products.module';
import { TokenModule } from 'src/token/token.module';
import { User, UserShema } from 'src/users/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserShema }]),
    ProductOrderModule,
    TokenModule
],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}















// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ProductOrderModule } from 'src/products/products.module';
// import { Product, ProductOrderShema } from 'src/products/shemas/products.schema';
// import { Token, TokenShema } from 'src/token/schemas/token.schema';
// import { TokenModule } from 'src/token/token.module';
// import { TokenService } from 'src/token/token.service';
// import { User, UserShema } from 'src/users/schemas/user.schema';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserShema },
//       // { name: Product.name, schema: ProductOrderShema},
//       // { name: Token.name, schema: TokenShema},
//     ]),
//     ProductOrderModule,
// ],
//   controllers: [UserController],
//   providers: [UserService]
// })
// export class UserModule {}