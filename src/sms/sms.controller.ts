import { Body, Controller, Post } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { TokenService } from "src/token/token.service";
import { getRandomArbitrary } from "src/utils";
import { SmsService } from "./sms.service";

@Controller('request-code')
export class SmsController extends SmsService {

    public phoneNumber: number;
    public textCode: number;
    public checkNumder: boolean = false;
    public tokenService: TokenService;
    constructor(private eventEmitter: EventEmitter2) {super()}

    @Post()
    public sendCode(@Body() phone: any) {
        if(this.checkNumder === false) {
            this.phoneNumber = phone?.phoneNumber
            this.textCode = getRandomArbitrary(1000, 9999)
            this.sendSms(phone?.phoneNumber, this.textCode)
        }
    }

    @Post('checked')
    public statusRegistration(@Body() text: any){
        // console.log(this.textCode, "this.textCode ---------------");
        
        if(Number(text?.codeNumber) === this.textCode) {
        //    console.log(this.textCode, "this.textCode");
        //    console.log(this.phoneNumber, "this.phoneNumber");
           this.checkNumder = true

           this.eventEmitter.emit(
            'valid:number',
            { isActivated: this.checkNumder, phone: this.phoneNumber }
          )
       }
    }
}
