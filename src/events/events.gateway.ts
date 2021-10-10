import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'net';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  public msg: any = {
    version: 1,
    user_name: 'tbezhenova@yandex.ru',
    api_key: 't8jf5szp7iabqq4uv4dykoqsezyk7n79',
    action: 'auth.login',
    app_name: 'svisni-sushi',
  };

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('subscribe-moizvonki')
  async moizvonki(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    client.connect('wss://tanak.moizvonki.ru/wsapi/', this.msg);
    console.log('data ------------- ', data);
    return data;
  }
}
