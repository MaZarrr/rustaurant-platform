import { Body, Controller, Post } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller()
export class MailController {
    constructor(private readonly mailService: MailService){  }
    /**
     * sendOrder
     */
    @Post('svisni/send-order')
    public sendOrder(@Body() formDataOrderDto: any): Promise<void> {
        console.log("formDataOrderDto___", formDataOrderDto);
        return this.mailService.sendOrder(formDataOrderDto);
    }
}