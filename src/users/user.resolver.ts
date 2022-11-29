import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account-dto';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';
import { VerifyEmaiInput, VerifyEmailOutput } from './dto/verify-email.dto';
import { VerifyPhoneInput, VerifyPhoneOutput } from './dto/verify-phone.dto';
import { User } from './enities/user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly usersService: UserService
    ) {}

  @Mutation((returns) => CreateAccountOutput)
  public async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Query((returns) => CreateAccountOutput)
  async testFN(): Promise<CreateAccountOutput> {
    console.log("await this.usersService.nameTest({})1", this.usersService.nameTest());
    console.log("await this.usersService.nameTest({})2", this.usersService.nameTest());
    // console.log("await this.usersService.nameTest({})3", await this.usersService.nameTest({})._subscribe);
    // this.usersService.nameTest({}).subscribe((e) => {
    //   console.log("eeeee______", e);
      
    // })
    return this.usersService.nameTest();
  }


  /**
   * login
   */
  @Mutation((returns) => LoginOutput)
  public async login(
    @Args('input') loginInput: LoginInput,
  ): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((returns) => User)
  // @UseGuards(AuthGuard) // !!! APP_GUARD in Auth Module
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query((returns) => UserProfileOutput)
  @Role(['Any'])
  public async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Mutation((returns) => EditProfileOutput)
  @Role(['Any'])
  public async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((returns) => VerifyEmailOutput)
  public verifytEmail(@Args('input') verifyEmailInput: VerifyEmaiInput) {}

  @Mutation((returns) => VerifyPhoneOutput)
  public verifyPhone(
    @Args('input') { code }: VerifyPhoneInput,
  ): Promise<VerifyPhoneOutput> {
    return this.usersService.verifyPhone(code);
  }

  // @Mutation(returns => VerifyPhoneOutput)
  // async verifyPhone(@Args('input') { code }: VerifyPhoneInput): Promise<VerifyEmailOutput>{
  //     try { // 59 learning 3.55 sec !!! убран трай катч
  //         this.usersService.verifyPhone(code)
  //         return {
  //             ok: true
  //         }
  //     } catch (error) {
  //         return {
  //             ok: false,
  //             error
  //         }
  //     }
  // }
}
