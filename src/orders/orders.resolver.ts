import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.constants";
import { EditDishOutput } from "src/restaurants/dto/edit-dish.dto";
import { User } from "src/users/enities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { EditOrderInput } from "./dtos/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { GetOrdersInputType, GetOrdersOutput } from "./dtos/get-orders.dto";
import { OrderUpdatesInput } from "./dtos/order-updates.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./orders.service";

@Resolver(of => Order)
export class OrderResolver {
    constructor(
        private readonly ordersService: OrderService,
        @Inject(PUB_SUB)
        private readonly pubSub: PubSub
        ){}

    @Mutation(returns => CreateOrderOutput)
    @Role(['Client'])
    public async createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput: CreateOrderInput
    ): Promise<CreateOrderOutput> {
       return this.ordersService.createOrder(customer, createOrderInput)
    }

    @Query(returns => GetOrdersOutput)
    @Role(['Any'])
    public async getOrders(
        @AuthUser() user: User,
        @Args('input') getOrdersInput: GetOrdersInputType
    ): Promise<GetOrdersOutput> {
        return this.ordersService.getOrders(user, getOrdersInput)
    }

    @Query(returns => GetOrderOutput)
    @Role(['Any'])
    public async getOrder(
        @AuthUser() user: User,
        @Args('input') getOrderInput: GetOrderInput
    ): Promise<GetOrderOutput> {
        return await this.ordersService.getOrder(user, getOrderInput)
    }

    @Mutation(returns => EditDishOutput)
    @Role(['Any'])
    public async editOrder(
        @AuthUser() customer: User,
        @Args('input') editOrderInput: EditOrderInput
    ): Promise<EditDishOutput> {
       return this.ordersService.editOrder(customer, editOrderInput)
    }

    @Mutation(returns => Boolean)
    async orderReady(@Args('orderId') orderId: number) {
        await this.pubSub.publish('hot', { orderSubscription: orderId })
        return true
    }


    @Subscription(returns => Order, {
        filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
            // filter: (payload, _, context) => {
            return ownerId === user.id;
        },
        resolve: ({ pendingOrders: { order } }) => order,
    })
    // @Role(['Owner'])  
    @Role(['Owner'])
    public pendingOrders(){
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
    }

    @Subscription(returns => Order)
    @Role(['Delivery'])
    public cookedOrders() {
        return this.pubSub.asyncIterator(NEW_COOKED_ORDER)
    }

    @Subscription(returns => Order, {
        filter:  (
            { orderUpdates: order }: { orderUpdates: Order }, 
            { input }: { input: OrderUpdatesInput }, 
            { user }: { user: User }
            ) => {
            if(
                order.driverId !== user.id && 
                order.customerId !== user.id && 
                order.restaurant.ownerId !== user.id
                ) {
                    return false
                }
            return order.id === input.id
        }
    })
    @Role(['Any'])
    public orderUpdates(
        @Args('input') orderUpdatesInput: OrderUpdatesInput
    ) {
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE)
    }

    @Mutation(returns => TakeOrderOutput)
    @Role(['Delivery'])
    public takeOrder( // принять заказ
        @AuthUser() driver: User,
        @Args('input') takeOrderInput: TakeOrderInput
    ): Promise<TakeOrderOutput > {  
        return this.ordersService.takeOrder(driver, takeOrderInput)
    }
}

// own eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImlhdCI6MTYzMTk4MTUyNH0.g4SBEJePEZXHW96qP9pmhRbU5D6OWQu1DGtD9fJsiXA
// deliv eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImlhdCI6MTYzMTk4MTU2MH0.AoxrdgCJe5kiUULdls1QMwwdrHQPf9egkrrMhi_XU3c