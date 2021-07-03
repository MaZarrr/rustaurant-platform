import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token, TokenDocument } from "src/token/schemas/token.schema";

@Injectable()
export class TokenService {

    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        private jwtService: JwtService
        ) {}

    public async generateTokens(payload: any){
        const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m' })
        const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    public async saveToken(userId, refreshToken: string){
        const tokenData = await this.tokenModel.findOne({ user: userId })
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await this.tokenModel.create({ user: userId, refreshToken })
        return token;
    }
}