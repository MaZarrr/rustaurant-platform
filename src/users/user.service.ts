import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account-dto';
import { LoginInput } from './dto/login.dto';
import { User } from './enities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { Verification } from './enities/verification.entity';
import { VerifyPhoneOutput } from './dto/verify-phone.dto';
import { UserProfileOutput } from './dto/user-profile.dto';
import { SmsService } from 'src/sms/sms.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * createAccount
   */
  public async createAccount({
    phone,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exist = await this.users.findOne({ phone });
      if (exist) {
        return {
          ok: false,
          error: 'Пользователь с таким телефоном уже существует',
        };
      }

      const user = await this.users.save(
        this.users.create({ phone, password, role }),
      );

      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );

      if(!user.verified) {
        this.smsService.sendSms(user.phone, verification.code);
      }
      return { ok: true };


      // if(!user.verified){
      //   this.smsService.sendSms(user.phone, verification.code)
      //   const verified = await this.verifyPhone(verification.code)
      //   console.log(verified);
      //     return { ok: false }
      //   }
      // this.mailService.sendVerificationEmail(user.email, verification.code)


    } catch (error) {
      return { ok: false, error: 'Не удалось создать учётную запись.' };
    }
  }


  // public async createAccount({
  //   phone,
  //   password,
  //   role,
  // }: CreateAccountInput): Promise<CreateAccountOutput> {
  //   try {
  //     const exist = await this.users.findOne({ phone });
  //     if (exist) {
  //       return {
  //         ok: false,
  //         error: 'Пользователь с таким телефоном уже существует',
  //       };
  //     }

      
  //     let user: User = null
  //     if(exist.verified) {
  //       user = await this.users.save(
  //         this.users.create({ phone, password, role }),
  //       );
  //     }

  //     const verification = await this.verifications.save(
  //       this.verifications.create({
  //         user,
  //       }),
  //     );

  //     if(!exist.verified) {
  //       this.smsService.sendSms(user.phone, verification.code);
  //     }
  //     // if(!user.verified){
  //     //   this.smsService.sendSms(user.phone, verification.code)
  //     //   const verified = await this.verifyPhone(verification.code)
  //     //   console.log(verified);
  //     //     return { ok: false }
  //     //   }

  //     // this.mailService.sendVerificationEmail(user.email, verification.code)

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: 'Не удалось создать учётную запись.' };
  //   }
  // }


  /**
   * login
   */
  public async login({
    phone,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // find user with phone
    // check if the password is correct
    // make jwt and give it to rhe user
    try {
      const user = await this.users.findOne(
        { phone },
        { select: ['id', 'password'] },
      );

      if (!user) {
        return {
          ok: false,
          error: 'Такого пользователя не найдено',
        };
      }

      const codeCorrect = await user.checkCodePassword(password);
      if (!codeCorrect) {
        return {
          ok: false,
          error: 'Неверный код',
        };
      }

      // const token = jwt.sign({ id: user.id }, this.config.get('SECRET_KEY'))
      // console.log(user);
      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  public async findById(id: number): Promise<UserProfileOutput> {
    // public async findById(id: number): Promise<User> {
    try {
      // const user = await this.users.findOne({ id });
      const user = await this.users.findOneOrFail({ id });
      if (user) {
        return {
          ok: true,
          user,
        };
      }
    } catch (error) {
      return { ok: false, error: 'Пользователь не найден.' };
    }
  }

  public async editProfile(
    userId: number,
    { phone, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);
      if (phone) {
        user.phone = phone;
        user.verified = false;
        await this.verifications.delete({user: { id: user.id }})
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );

        // this.mailService.sendVerificationEmail(user.phone, verification.code)
        this.smsService.sendSms(user.phone, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'Не удалось обновить профиль.',
      };
    }

    // return this.users.save(userId, { ...editProfileInput })
  }


  //  форма 1
  // - клиент - вводит телефон
  // - сервер - отправляет смс с кодом
  // форма 2
  // - клиент - меняет форму на ввод кода и вводит код
  // - сервер - проверяет код пользователя и код из базы
  // - сервер - если верно то создаем аккаунт и отвечаем пользователю true



  public async verifyPhone(code: number): Promise<VerifyPhoneOutput> {
    // !!! createAccaynt нас записывает в базу
    // пользователь отправляет эту мутацию
    // меняется форма на клиенте где мы ожидаем верный код от пользвователя
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );

      if(verification){
      // if (verification.code === code) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        // await this.verifications.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Аутентификация не пройдена.' };
    } catch (error) {
      return { ok: false, error: "Телефон не верефицирован." };
    }
  }
}

// import { Injectable} from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { TokenService } from 'src/token/token.service';
// import { User, UserDocument } from 'src/users/schemas/user.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import { IUser } from './interfaces/user.interface';
// import { ProductOrderService } from 'src/products/products.service';
// import { UserDto } from './dto/user-dto';

// @Injectable()
// export class UserService {
//   public createUserDto: CreateUserDto;

//   constructor(
//     @InjectModel(User.name) private userModel: Model<UserDocument>,
//     private productService: ProductOrderService,
//     private tokenService: TokenService
//     ) {}

//   public async registration(payload): Promise<any> {
//     console.log("payload registration user service", payload);

//     if(payload.isActivated === true) {
//       const user = new this.userModel({
//         phone: payload.phone,
//         isActivated: payload.isActivated,
//         timestamp: new Date(),
//         age: ""
//       })
//       user.save()

//       console.log("createdUser === ", user);
//       const userDto = new UserDto(user._id, user.isActivated, user.phone)
//       const tokens = await this.tokenService.generateTokens({ ...userDto })
//       console.log(" token servise generate tokens", tokens);
//       this.tokenService.saveToken(userDto.id, tokens.refreshToken)

//       return {
//         ...tokens,
//         user: userDto
//       }
//     }
//   }

// // async findUser(phone) {
// //   return await this.userModel.findOne(phone)
// // }

// //   async create(createUserDto: CreateUserDto): Promise<IUser> {
// //     const createdUser = new this.userModel(createUserDto);
// //     return createdUser.save();
// //   }

//   async findAll(): Promise<IUser[]> {
//     console.log(this.userModel.find().exec());
//     return this.userModel.find().exec();

//   }
// }
