import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class SmsService {
    public sendSms(phone: number, code: number) {
        axios({
            method: "POST", 
            data: {
                "user_name":"tbezhenova@yandex.ru", 
                "api_key":"t8jf5szp7iabqq4uv4dykoqsezyk7n79", 
                "action":"calls.send_sms", "to": String(phone), 
                "text": String(code)
            },
            url: "https://tanak.moizvonki.ru/api/v1"
          })
    }
}