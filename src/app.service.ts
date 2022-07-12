import { Injectable } from '@nestjs/common';
import { transformEmailData } from './teamplates/orderTeamplate';
import { transformSocialData } from './teamplates/orderTeamplateSendVK';
import { MailerService } from '@nestjs-modules/mailer';
import VkBot from 'node-vk-bot-api';

@Injectable()
export class AppService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async sendOrder(formDataOrderDto: any): Promise<void> {
    const emailData = transformEmailData(formDataOrderDto);
    this.mailerService
      .sendMail(emailData)
      .then(() => {})
      .catch((error) => console.log(error)
      );
  }

  public async sendMessageVK(formDataOrderDto: any): Promise<void> {
    const socialData = transformSocialData(formDataOrderDto);
    let bot = new VkBot({
      token: process.env.SOCIAL_API,
      group_id: Number(process.env.GROUP_ID),
    });
    bot.sendMessage([
      Number(process.env.USER_ONE),
      Number(process.env.USER_TWO),
      Number(process.env.USER_THREE),
    ] as any, socialData);
  }
  }
