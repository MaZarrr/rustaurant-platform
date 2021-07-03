import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenShema } from './schemas/token.schema';
import { TokenService } from './token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenShema }]), 
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
  })
],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}