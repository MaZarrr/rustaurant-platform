import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { IUser } from './interfaces/user.interface';
import { OnEvent } from '@nestjs/event-emitter';

@Controller('register')
export class UserController {
  
  public isAuth: boolean
  public phoneCheck: number

  constructor(private userService: UserService) {}

  @OnEvent('valid:number')
  public async login(payload){
      console.log("@OnEvent('valid:number')", payload);
      if(payload.isActivated) {
        console.log("typeOf ==== ", typeof payload.phone);
        this.userService.registration(payload)
      }

  }

  @Get()
  public async logout() {
    try {

    } catch(err) {

    }
  }

  @Get()
  public async getUsers() {
    try {

    } catch(err) {

    }
  }

  @Get()
  async findAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateUserDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}


// import { ListAllEntities } from './dto/list-all-entities.dto';
// import { ConnectedSocket } from '@nestjs/websockets';

// type Message = {
//   action: string
//   to: string
//   text: string
// }
// public socket: any = new WebSocket("wss://tanak.moizvonki.ru/wsapi/");

  // @Post()
  // async registration(
  //   @Body() createUserDto: CreateUserDto, 
  //   // @ConnectedSocket() client: Socket
  //   ) {

  //     try {
  //       this.userService.registration()
  //     } catch(err) {

  //     }
  //     // принятие номера
  //     // проверка в базе
  //     // подключение к сокету и отправка sms с рандомным числом
  //     // сохранение рандомого числа
  //     // подключение к сокету и отправка sms с рандомным числом - this.phoneCheck
  //     if(this.phoneCheck === createUserDto.ckeckedNum) {
  //       // успешная аунтификация
  //       this.isAuth = true
  //       return {isAuth: this.isAuth, } 
  //     } else {
  //       // не успешная аунтификация
  //       return this.isAuth = false
  //     }
  // }
