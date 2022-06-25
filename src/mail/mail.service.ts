import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVars, MailModuleOptions } from './mail.interfaces';
import * as FormData from 'form-data';
import got from 'got';
import * as SendGrid from '@sendgrid/mail';
import { transformEmailData } from './teamplates/orderTeamplate';
// require('dotenv').config();

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: MailModuleOptions,
  ) {
    SendGrid.setApiKey(process.env.SEND_GRID_API);
  }
    
  public async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVars[],
  ): Promise<boolean> {
    const form = new FormData();

    // form.append("from", `Excited User <mailgun@${this.options.domain}>`)
    form.append('from', `Новый заказ <svisni-sushi@yandex.ru>`);
    form.append('to', `vitalistarkiii@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    form.append('v:code', 'asasa');
    form.append('v:username', 'virali');
    emailVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });

      return true;

    } catch (error) {
      console.log(error);
      return false;
    }
  }
  public sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Верификация email', 'verify-email', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }


  public async sendOrder(formDataOrderDto: any): Promise<void> {
   
    const emailData = transformEmailData(formDataOrderDto)
    console.log("emailData___", emailData);
    
    SendGrid
    .send(emailData)
    .then(() => {}, error => {
    console.error(error);

    if (error.response) {
        console.error(error.response.body)
    }
  })
};
}
