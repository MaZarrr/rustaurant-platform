import {
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { ProductOrderModule } from './products/products.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/enities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { Verification } from './users/enities/verification.entity';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { Restaurant } from './restaurants/enities/restaurant.enities';
import { Category } from './restaurants/enities/category.enities';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';
import { Dish } from './restaurants/enities/dish.entities';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CommonModule } from './common/common.module';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payments.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAIL_API_KEY: Joi.string().required(),
        MAIL_FROM_EMAIL: Joi.string().required(),
        MAIL_DOMAIN_NAME: Joi.string().required(),
        SMS_API_KEY: Joi.string().required(),
        SMS_USER_NAME: Joi.string().required(),
        SMS_API_URL: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
        EMAIL_TO: Joi.string().required(),
        EMAIL_API: Joi.string().required(),
        SOCIAL_API: Joi.string().required(),
        GROUP_ID: Joi.number().required(),
        USER_ONE: Joi.number().required(),
        USER_TWO: Joi.number().required(),
        USER_THREE: Joi.number().required()
        // DB_TYPE: Joi.required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [User, Verification, Restaurant, Category, Dish, Order, OrderItem, Payment],
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: process.env.NODE_ENV !== 'prod' &&  process.env.NODE_ENV !== 'test',
      // logging: true,
    }),
    MailerModule.forRoot({
      transport: `smtps://${process.env.EMAIL_FROM}:${process.env.EMAIL_API}@smtp.yandex.ru`,
      defaults: {
        from: `"WebWork" <${process.env.EMAIL_FROM}>`,
      },
    }),
    // MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      context: ({ req, connection }) => { /// !!! 130
        const TOKEN_KEY = 'x-jwt'
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY]
        }
      },
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAIL_API_KEY,
      fromEmail: process.env.MAIL_FROM_EMAIL,
      domain: process.env.MAIL_DOMAIN_NAME,
    }),
    SmsModule.forRoot({
      apiKey: process.env.SMS_API_KEY,
      user_name: process.env.SMS_USER_NAME,
      url: process.env.SMS_API_URL,
    }),
    AuthModule,
    UserModule,
    RestaurantsModule,
    OrdersModule,
    CommonModule,
    PaymentsModule,
    // SmsModule,
    // ProductOrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule{}

// // или app use
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(JwtMiddleware).forRoutes({
//       path: '/graphql',
//       method: RequestMethod.POST,
//     });
//   }
// }
// export class AppModule {
//   constructor(private connection: Connection) {}
// }
