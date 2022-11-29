import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PubSub } from "graphql-subscriptions";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.constants";
import { EditDishOutput } from "src/restaurants/dto/edit-dish.dto";
import { Dish } from "src/restaurants/enities/dish.entities";
import { Restaurant } from "src/restaurants/enities/restaurant.enities";
import { User, UserRole } from "src/users/enities/user.entity";
import { Repository } from "typeorm";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { EditOrderInput } from "./dtos/edit-order.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { GetOrdersInputType, GetOrdersOutput } from "./dtos/get-orders.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { OrderItem } from "./entities/order-item.entity";
import { Order, OrderStatus } from "./entities/order.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItem: Repository<OrderItem>,
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
        ){}


        /**
         * createOrder
         */
        public async createOrder(
            customer: User,
            {restautantId, items}: CreateOrderInput,
        ): Promise<CreateOrderOutput> {
            try {
                const restaurant = await this.restaurants.findOne({ where: { id: restautantId } })
                // {where: {id: parseInt(req.params.id, 10)}}
                if(!restaurant) {
                    return {
                        ok: false,
                        error: "Ресторан не найден"
                    };
                }
                
                let orderFinalPrice = 0; // !!! 124
                const orderItems: OrderItem[] = [];
                for(const item of items) {
                    const dish = await this.dishes.findOne({ where: { id: item.dishId }} )
                    if(!dish){
                    // прервать все
                        return {
                            ok: false,
                            error: "Блюдо не найдено"
                        };
                    }
    
                    let dishFinalPrice = dish.price; // !!!
                    
                    for(const itemOption of item.options) {      
                        const dishOption = dish.options.find(
                            dishOpt => dishOpt.name === itemOption.name
                            );
                           if(dishOption) {
                               if(dishOption.extra) {
                                dishFinalPrice = dishFinalPrice + dishOption.extra;
                               } else {
                                const dishOptionChoice = dishOption.choices.find(
                                    optionChoice => optionChoice.name === itemOption.choice
                                    );
                                    if(dishOptionChoice){
                                        if(dishOptionChoice.extra) {
                                            dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                                            
                                        }
                                    }  
                            }
                               
                        }
                    }
                    orderFinalPrice = orderFinalPrice + dishFinalPrice; 
                    const orderItem = await this.orderItem.save(
                        this.orderItem.create({
                            dish,
                            options: item.options
                        }))     
                    orderItems.push(orderItem)           
                }
    
                const order = await this.orders.save(
                    this.orders.create({
                        customer,
                        restaurant,
                        total: orderFinalPrice,
                        items: orderItems
                    })
                );

                await this.pubSub.publish(NEW_PENDING_ORDER, { 
                    pendingOrders: { order, ownerId: restaurant.ownerId } })
                
                return {
                    ok: true
                }
            } catch (error) {
                return { 
                    ok: false,
                    error: "Заказ не создан"
                }
            }
        }

        // !!! 125
        public async getOrders(
            user: User,
            { status }: GetOrdersInputType
        ): Promise<GetOrdersOutput>{

            try {
                let orders: Order[];
                if(user.role === UserRole.Client){
                    orders = await this.orders.find({
                        where: {
                            customer: true,
                            ...(status && { status })
                        }
                    });
                } else if(user.role === UserRole.Delivery) {
                    orders = await this.orders.find({
                        where: {
                            driver: true,
                            ...(status && { status })
                        }
                    });
                } else if(user.role === UserRole.Owner) {
                    const restaurants = await this.restaurants.find({
                        where: {
                            owner: true
                        },
                        // select: ['orders'], // Ошибка: столбец заказов не найден в объекте "Ресторан".
                        relations: ['orders']
                    });
                    // console.log(restaurants.map(rest => rest.orders).flat());
                    orders = restaurants.map(restaurant => restaurant.orders).flat(1);  
                    if(status) {
                        orders = orders.filter(order => order.status === status)
                    }
                }
                // if(user.role === UserRole.Client){
                //     orders = await this.orders.find({
                //         where: {
                //             customer: user,
                //             ...(status && { status })
                //         }
                //     });
                // } else if(user.role === UserRole.Delivery) {
                //     orders = await this.orders.find({
                //         where: {
                //             driver: user,
                //             ...(status && { status })
                //         }
                //     });
                // } else if(user.role === UserRole.Owner) {
                //     const restaurants = await this.restaurants.find({
                //         where: {
                //             owner: user
                //         },
                //         // select: ['orders'], // Ошибка: столбец заказов не найден в объекте "Ресторан".
                //         relations: ['orders']
                //     });
                //     // console.log(restaurants.map(rest => rest.orders).flat());
                //     orders = restaurants.map(restaurant => restaurant.orders).flat(1);  
                //     if(status) {
                //         orders = orders.filter(order => order.status === status)
                //     }
                // }
                return {
                    ok: true,
                    orders
                };
            } catch (error) {
                return {
                    ok: false,
                    error: "Не удалось получить заказы"
                }
            }
        }

        public async getOrder(
            user: User,
            { id: orderId }: GetOrderInput
        ): Promise<GetOrderOutput>{
            try {
                
                const order = await this.orders.findOne({ where: { id: orderId }, relations: { restaurant: true }} )
                if(!order){
                    return {
                        ok: false,
                        error: "Заказ не найден."
                    };
                }

                if(!this.canSeeOrder(user, order)) {
                    return {
                        ok: false,
                        error: "Вы не можете увидеть информацию."
                    };
                }
                    return {
                        ok: true,
                        order
                    }
            } catch (error) {
                return {
                    ok: false,
                    error: "Заказ не найден"
                }
            }
        }

        public async editOrder(
            user: User,
            { id: orderId, status }: EditOrderInput
        ): Promise<EditDishOutput>{
            try {
                // const order = await this.orders.findOne(orderId, { /// !!! 138 указано eadger true  в order entity что дает возможность не указывать relations отношения
                //     relations: ['restaurant', 'customer', 'driver']
                // });
                const order = await this.orders.findOne({ where: { id: orderId }});

                if(!order) {
                    return {
                        ok: false,
                        error: "Заказ не найден."
                    }
                }

                if(!this.canSeeOrder(user, order)) {
                    return {
                        ok: false,
                        error: "Вы не можете увидеть информацию."
                    };
                }

                let canEdit: boolean = true;

                if(user.role === UserRole.Client){
                    canEdit = false;
                }
                if(user.role === UserRole.Owner){
                    if(status !== OrderStatus.Cooking && 
                        status !== OrderStatus.Cooked) {
                            canEdit = false;
                        }
                }
                if(user.role === UserRole.Delivery){
                    if(status !== OrderStatus.PickedUp && 
                        status !== OrderStatus.Delivered) {
                            canEdit = false;
                        }
                }
                
                if(!canEdit) {
                    return {
                        ok: false,
                        error: "У вас нет доступа"
                    }
                }

                await this.orders.save([{
                    id: orderId,
                    status
                }]);

                const newOrder = { ...order, status }
                if(user.role === UserRole.Owner) {
                    if(status === OrderStatus.Cooked)
                    await this.pubSub.publish(NEW_COOKED_ORDER, { 
                        cookedOrders: {...order, status} })
                }                

                await this.pubSub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder })

                return {
                    ok: true
                }
            } catch (error) {
                return {
                    ok: false,
                    error: "Не удалось отредактировать"
                }
            }
        }

        public canSeeOrder(user: User, order: Order): boolean {
            let canSee: boolean = true
            // информация доступ исходя из роли
            if(
                user.role === UserRole.Client && 
                order.customerId !== user.id
                ) {
                    canSee = false
            }
            if(
                user.role === UserRole.Delivery && 
                order.driverId !== user.id
                ) {
                    console.log(order.driverId);
                    console.log(user.id);
                    
                    canSee = false
            }
            if(
                user.role === UserRole.Owner && 
                order.restaurant.ownerId !== user.id
                ){
                    canSee = false;
                }

                return canSee;
        }

        // public async takeOrder(
        //     driver: User,
        //     orderInput: TakeOrderInput
        // ): Promise<TakeOrderOutput>{
        //     try {
        //         const order = await this.orders.findOne({ where: { id: orderInput.id } })
        //         if(!order) {
        //             return {
        //                 ok: false,
        //                 error: "Заказ не найден"
        //             }
        //         };
        //         if(order.driver){ /// !!! 140
        //             return {
        //                 ok: false,
        //                 error: "У этого заказа уже есть водитель"
        //             }
        //         }
        //         await this.orders.save({  { id: orderId, driver} });
        //         await this.pubSub.publish(NEW_ORDER_UPDATE, { 
        //             orderUpdates: {...order, driver} });
                
        //         return {
        //             ok: true
        //         }
        //     } catch (error) {
        //         return {
        //             ok: false,
        //             error: "Не удалось обновить заказ."
        //         }
        //     }
        // }
    }