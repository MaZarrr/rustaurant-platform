import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Verification } from '../enities/verification.entity';

@ObjectType()
export class VerifyPhoneOutput extends CoreOutput {}

@InputType()
export class VerifyPhoneInput extends PickType(Verification, ['code']) {}
