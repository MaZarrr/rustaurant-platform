// import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user-dto';
// import { IUser } from './interfaces/user.interface';
// import { OnEvent } from '@nestjs/event-emitter';
// import { application } from 'src/Services/Application';
// import { Response } from 'express'

// @Controller('register')
// export class UserController {

//   public isAuth: boolean
//   public phoneCheck: number

//   constructor(
//     private userService: UserService,
//     ) {}

//   // @OnEvent('valid:number')
//   @Post('/status')
//   public async login(@Res({ passthrough: true }) response: Response){
//       if(application.checkNumder) {
//         console.log("if(application.checkNumder) { trueeeeee  ");
//         const usesrData = await this.userService.registration({ phone: application.phone, isActivated: application.checkNumder })
//         response.cookie('refreshToken', usesrData.refreshToken, {maxAge:  3})

//         return
//       }
//       return "ВВедите корректный телефон"
//   }

//   @Get()
//   public async logout() {
//     try {

//     } catch(err) {

//     }
//   }

//   // @Post('/status')
//   // public async getUsers(phone) {
//   //   try {
//   //    return this.userService.findUser(phone)
//   //   } catch(err) {

//   //   }
//   // }

//   @Get()
//   async findAll(): Promise<IUser[]> {
//     return this.userService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return `This action returns a #${id} cat`;
//   }

//   @Put(':id')
//   update(@Param('id') id: string, @Body() updateCatDto: UpdateUserDto) {
//     return `This action updates a #${id} cat`;
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return `This action removes a #${id} cat`;
//   }
// }
