import { Injectable } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "src/restaurants/enities/restaurant.enities";
import { User } from "src/users/enities/user.entity";
import { LessThan, Repository } from "typeorm";
import { CreatePaymentInput, CreatePaymentOutput } from "./dto/create-payment.dto";
import { GetPaymentsOutput } from "./dto/get-payment.dto";
import { Payment } from "./entities/payments.entity";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly payments: Repository<Payment>,
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        // private schedulerRegistry: SchedulerRegistry
        ){}

        public async createPayment(
            owner: User,
            { transactionId, restaurantId }: CreatePaymentInput
        ): Promise<CreatePaymentOutput> {
            try {
                const restaurant = await this.restaurants.findOne(restaurantId)
                if(!restaurant){
                    return {
                        ok: false,
                        error: "Ресторан не найден"
                    };
                }
                if(restaurant.ownerId !== owner.id) {
                    return {
                        ok: false,
                        error: "Не разрешено это делать."
                    };
                }

                await this.payments.save(this.payments.create({
                    transactionId,
                    user: owner,
                    restaurant
                }));

                // date !!!
                restaurant.isPromoted = true;
                const date = new Date();
                date.setDate(date.getDate() + 7)
                restaurant.promotedUntil = date;
                this.restaurants.save(restaurant)

                return {
                    ok: true
                }
            } catch (error) {
                return {
                    ok: false,
                    error: "Платеж не создан."
                }           
            }
        }

        public async getPayments(user: User): Promise<GetPaymentsOutput> {
            try {
                const payments = await this.payments.find({ user })
                return {
                    ok: true,
                    payments
                }
            } catch (error) {
                return {
                    ok: false,
                    error:  "Не удалось загрузить платежи."
                }
            }
        }

        // https://github.com/typeorm/typeorm/blob/master/docs/find-options.md   // !!!
        @Interval(225000) // находим всех не оплаченных
        public async checkPromotedRestaurants() {
            const restaurants = await this.restaurants.find({ 
                isPromoted: true,  
                promotedUntil: LessThan(new Date()) // SELECT * FROM "post" WHERE "likes" < 10
            })
            console.log(restaurants);
            restaurants.forEach(async (restaurant) => {
                restaurant.isPromoted = false // сброс продвижения // дата окончания продвижения меньше текущей даты означает конец продвижения
                restaurant.promotedUntil = null
                await this.restaurants.save(restaurant)
            })
        }
    }

    // !!! крон для проверки платежа до указанной даты
    // @Cron("30 * * * * *", {
    //     name: "myJob"
    // })
    // public async checkForPayments() {
    //     const job = this.schedulerRegistry.getCronJob('myJob')
    //     job.stop()
        
    // }

    // @Interval(5000)
    // public async checkForPaymentsI() {
    //     console.log("checking for payments....");
        
    // }
