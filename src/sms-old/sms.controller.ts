import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { application } from 'src/Services/Application';
import { getRandomArbitrary } from 'src/utils';
import { SmsServiceOld } from './sms.service';

@Controller('request-code')
export class SmsController extends SmsServiceOld {
  public phoneNumber: number;
  public textCode: number;
  public checkNumder: boolean = false;
  constructor(private eventEmitter: EventEmitter2) {
    super();
  }

  @Post()
  public sendCode(@Body() phone: any) {
    if (this.checkNumder === false) {
      this.phoneNumber = phone?.phoneNumber;
      application.phone = String(this.phoneNumber);
      this.textCode = getRandomArbitrary(1000, 9999);
      this.sendSms(phone?.phoneNumber, this.textCode);
    }
  }

  @Post('checked')
  public statusRegistration(@Body() text: any) {
    if (Number(text?.codeNumber) === this.textCode) {
      this.checkNumder = true;
      application.checkNumder = this.checkNumder;
      return {
        isAuth: true,
        text: 'Вы успешно зарегестрированы!',
        phone: String(this.phoneNumber),
      };
    }

    return {
      isAuth: false,
      text: 'Введите корректный телефон.',
    };
  }
}
