import { Test } from '@nestjs/testing/test';
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { SmsService } from "./sms.service";
import axios from 'axios';

jest.mock('axios')
// jest.mock('form-data', () => {
//     return {
//         append: jest.fn()
//     };
// });

describe('SmsService', () => {
    let service: SmsService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
            SmsService, 
            {
                provide: CONFIG_OPTIONS,
                useValue: {
                    apiKey: "test-apiKey",
                    user_name: "test-username",
                    url: "test-url",
                }
            }
        ], 
        }).compile();
        service = module.get<SmsService>(SmsService);
    });

    it('должен быть определен', () => {
        expect(service).toBeDefined();
      });
    });