import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { User } from 'src/users/enities/user.entity';
import { Verification } from 'src/users/enities/verification.entity';
import { Repository } from 'typeorm';
import { SmsModuleOptions } from './sms.interfaces';

@Injectable()
export class SmsService {
  constructor(
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    @InjectRepository(User) 
    private readonly users: Repository<User>,
    @Inject(CONFIG_OPTIONS)
    private readonly options: SmsModuleOptions,
  ) {}

  public async sendSms(phone: string, code: number) {
      
      console.log("sendSms");
  
    // try {
    //   await axios({
    //     method: 'POST',
    //     data: {
    //       user_name: this.options.user_name,
    //       api_key: this.options.apiKey,
    //       action: 'calls.send_sms',
    //       to: phone,
    //       text: String(code),
    //     },
    //     url: this.options.url,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }
}
