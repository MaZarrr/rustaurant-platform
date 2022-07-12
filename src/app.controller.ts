import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  public async sendOrder(@Body() formDataOrderDto: any): Promise<void> {
      // console.log("formDataOrderDto___", formDataOrderDto);
      return await this.appService.sendOrder(formDataOrderDto);
  }

  @Post('sending')
  public async sendMessageVK(@Body() formDataOrderDto: any): Promise<void> {
   return this.appService.sendMessageVK(formDataOrderDto);
  }
}
