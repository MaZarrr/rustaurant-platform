import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsServiceOld } from './sms.service';

@Module({
  controllers: [SmsController],
  providers: [SmsServiceOld],
})
export class SmsModuleOld {}
