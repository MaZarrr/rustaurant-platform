import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { User } from 'src/users/enities/user.entity';
import { Verification } from 'src/users/enities/verification.entity';
import { SmsModuleOptions } from './sms.interfaces';
import { SmsService } from './sms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Verification, User])]
})
@Global()
export class SmsModule {
  static forRoot(options: SmsModuleOptions): DynamicModule {
    return {
      module: SmsModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        SmsService,
      ],
      exports: [SmsService],
    };
  }
}
