import { Controller } from "@nestjs/common";
import { TokenService } from "./token.service";

@Controller()
export class TokenController extends TokenService {
    
}