import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { User, UserShema } from 'src/users/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserShema }])],
  controllers: [UserController],
  providers: [UserService],
  // exports: [UserService]
})
export class UserModule {}