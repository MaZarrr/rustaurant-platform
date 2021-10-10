import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { CreateOrderOutput } from "src/orders/dtos/create-order.dto";
import { User } from "src/users/enities/user.entity";
import { CreatePaymentInput, CreatePaymentOutput } from "./dto/create-payment.dto";
import { GetPaymentsOutput } from "./dto/get-payment.dto";
import { Payment } from "./entities/payments.entity";
import { PaymentService } from "./payments.service";

@Resolver(of => Payment)
export class PaymentResolver {
    constructor(
        private readonly paymentService: PaymentService,
        ){}


        @Mutation(returns => CreatePaymentOutput)
        @Role(['Owner'])
        public createPayment(
            @AuthUser() owner: User,
            @Args('input') createPaymentInput: CreatePaymentInput
        ): Promise<CreateOrderOutput> {
            return this.paymentService.createPayment(owner, createPaymentInput)
        }

        @Query(returns => GetPaymentsOutput)
        @Role(["Owner"])
        public getPayments(
            @AuthUser() user: User
        ): Promise<GetPaymentsOutput> {
            return this.paymentService.getPayments(user)
        }

}
