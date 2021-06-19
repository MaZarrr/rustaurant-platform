import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenService } from 'src/token/token.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  public createUserDto: CreateUserDto;
  // private tokenService
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    // this.tokenService = tokenService
  }

  public async registration(payload: CreateUserDto) {
    console.log("registration payload", payload);
    
    if(payload.isActivated === true) {
      console.log("payload.checkNumder === true == registration");
      const createdUser = new this.userModel(payload)
      // console.log("tokenService", this.tokenService);
      
      // const tokens = this.tokenService.generateTokens(createdUser)
      // this.tokenService.saveToken(createdUser.id, tokens.refreshToken)
      // return {
      //   ...tokens,
      //   user: this.createUserDto
      // }
      // return createdUser.save()
    }

  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<IUser[]> {
    console.log(this.userModel.find().exec());
    return this.userModel.find().exec();
    
  }
}



// constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
// // async create(createCatDto: CreateCatDto): Promise<Cat> {
// //   const createdCat = new this.catModel(createCatDto);
// //   return createdCat.save();
// // }
// public async registration(payload?) {
//   // const candidate = this.userModel.findOne({ phone: payload.phone })
//   // if(candidate) {
//   //   console.log("candidate", candidate);
//   //   throw new Error(`Пользователь с таким телефоном ${payload.phone} уже существует!`)
//   // }

//   if(payload.checkNumder === true) {
//     console.log("createeeeeee =====");
//     const createdUser = new this.userModel({
//       userId: 323232,
//       ckeckedNum: 89231323,
//       username: "sdsdsdsd",
//       age: 23,
//       password: "sd232323",
//       phone: 89411234422,
//       })

//       return createdUser.save()
//     // const user = await this.userModel.create({ ...this.createUserDto, phone: Number(payload.phone), userId: 'd23dfase2e2deasd2' })
//     // console.log("user", user);
//     // return user.save()
//   }

// @Injectable()
// export class CatsService {
//   private readonly cats: Array<Cat> = [];

//   create(cat: Cat) {
//     this.cats.push(cat);
//   }

//   findAll(): Cat[] {
//     return this.cats;
//   }
// }