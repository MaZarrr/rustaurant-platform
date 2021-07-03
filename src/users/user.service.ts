import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenService } from 'src/token/token.service';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { ProductOrderService } from 'src/products/products.service';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
  public createUserDto: CreateUserDto;
  
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private productService: ProductOrderService,
    private tokenService: TokenService
    ) {}

  public async registration(payload): Promise<any> {
    console.log("payload registration user service", payload);
    
    if(payload.isActivated === true) {
      const user = new this.userModel({
        phone: payload.phone,
        isActivated: payload.isActivated,
        timestamp: new Date(),
        age: ""
      })
      user.save()
      
      console.log("createdUser === ", user);
      const userDto = new UserDto(user._id, user.isActivated, user.phone)
      const tokens = await this.tokenService.generateTokens({ ...userDto })
      console.log(" token servise generate tokens", tokens);
      this.tokenService.saveToken(userDto.id, tokens.refreshToken)
      
      return {
        ...tokens,
        user: userDto
      }
    }
  }

// async findUser(phone) {
//   return await this.userModel.findOne(phone)
// }

//   async create(createUserDto: CreateUserDto): Promise<IUser> {
//     const createdUser = new this.userModel(createUserDto);
//     return createdUser.save();
//   }

  async findAll(): Promise<IUser[]> {
    console.log(this.userModel.find().exec());
    return this.userModel.find().exec();
    
  }
}