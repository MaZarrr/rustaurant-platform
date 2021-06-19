import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import jwt from "jsonwebtoken";
import { Model } from "mongoose";
import { Token, TokenDocument } from "src/token/schemas/token.schema";

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {}

    public generateTokens(payload: any){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }

    public async saveToken(userId: string, refreshToken: string){
        const tokenData = await this.tokenModel.findOne({ user: userId })
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await this.tokenModel.create({ user: userId, refreshToken })
        return token;
    }
}