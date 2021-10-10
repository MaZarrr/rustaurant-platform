import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';


jest.mock("got", () => {
  return {
    post: jest.fn()
  }
})
const GRAPHQL_ENDPOINTS = '/graphql'

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    getConnection().dropDatabase()
    app.close();
  })

  describe('createAccount', async () => {
    const PHONE = "+79511306593"
    it('should create account', () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINTS)
      .send({
        query: `
        mutation {
          createAccount(input: {
            phone: "${PHONE}",
            role: Owner
          }){
            ok
            error
          }
        }
        `,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.createAccount.ok).toBe(true)
        expect(res.body.data.createAccount.error).toBe(null)
      })
      // .expect(res => console.log(res))
    });
    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINTS)
      .send({
        query: `
        mutation {
          createAccount(input: {
            phone: "${PHONE}",
            role: Owner
          }){
            ok
            error
          }
        }
        `,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.createAccount.ok).toBe(false)
        expect(res.body.data.createAccount.error).toBe('Пользователь с таким телефоном уже существует')
      })
    })
  })
  

  it.todo('login');
  it.todo('me');
  it.todo('verifyPhone');
  it.todo('findById');
  it.todo('editProfile');

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
});
