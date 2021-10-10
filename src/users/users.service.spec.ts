import { Test } from '@nestjs/testing/test';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { SmsService } from 'src/sms/sms.service';
import { Repository } from 'typeorm';
import { User } from './enities/user.entity';
import { Verification } from './enities/verification.entity';
import { UserService } from './user.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn()
});

const mockJwtService = {
  sign: jest.fn(() => 'signed-token'),
  verify: jest.fn(),
};

// const mockMailService = {
//     sign: jest.fn(),
//     verify: jest.fn(),
// }

const mockSmsService = {
    sendSms: jest.fn(),
};

type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('UserService', () => {
let service: UserService;
let smsService: SmsService;
let jwtService: JwtService;
let usersRepository: MockRepository<User>;
let verificationsRepository: MockRepository<Verification>;

beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: SmsService,
          useValue: mockSmsService,
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    smsService = module.get<SmsService>(SmsService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(User));
    verificationsRepository = module.get(getRepositoryToken(Verification));
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
        phone: '',
        password: '',
        role: 0,
    }

    it('должен потерпеть неудачу, если пользователь существует', async () => {
        usersRepository.findOne.mockResolvedValue({
            id: 1,
            phone: '+79999999999',
        });
        const result = await service.createAccount(createAccountArgs);
        expect(result).toMatchObject({
        ok: false,
        error: 'Пользователь с таким телефоном уже существует'
        });
    });
    
    it('создан новый user', async () => {
    usersRepository.findOne.mockResolvedValue(undefined)
    usersRepository.create.mockReturnValue(createAccountArgs)
    usersRepository.save.mockResolvedValue(createAccountArgs)
    verificationsRepository.create.mockReturnValue({
        user: createAccountArgs
    })
    verificationsRepository.save.mockResolvedValue({
        code: 1234,
    })

    const result = await service.createAccount(createAccountArgs);

    expect(usersRepository.create).toHaveBeenCalledTimes(1)
    expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs)

    expect(usersRepository.save).toHaveBeenCalledTimes(1)
    expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs)

    expect(verificationsRepository.create).toHaveBeenCalledTimes(1)
    expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs
    })

    expect(verificationsRepository.save).toHaveBeenCalledTimes(1)
    expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs
    })

    expect(smsService.sendSms).toHaveBeenCalledTimes(1)
    expect(smsService.sendSms).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number),
    );

    expect(result).toEqual({ ok: true })

    });

    it('должен завершиться ошибкой при исключении', async () => {
        try {
            usersRepository.findOne.mockRejectedValue(new Error(':)'))
            const result = await service.createAccount(createAccountArgs)
            expect(result).toEqual({ok: false, error: 'Не удалось создать учётную запись.'})
        } catch (error) {
            
        }
    })
  });

  describe('login', () => {
    // password при регистрации через почту 
    const loginArgs = {
        phone: '+79999999999',
        password: '+79999999999'
    }

    it('пользователя не существует', async () => {
        usersRepository.findOne.mockResolvedValue(null)

        const result = await service.login(loginArgs);

        expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
        expect(usersRepository.findOne).toHaveBeenCalledWith(
            expect.any(Object),
            expect.any(Object)
        )

        expect(result).toEqual({
            ok: false,
            error: 'Пользователя не существует.',
        });
    });
    
    it('должен быть неверный пароль', async () => {
        const mockedUser = {
            id: 1,
            checkCodePassword: jest.fn(() => Promise.resolve(false))
        };
        usersRepository.findOne.mockResolvedValue(mockedUser);
        const result = await service.login(loginArgs);
        expect(result).toEqual({ ok: false, error: 'Неверный код' })
        // console.log(result); !!! // выведет из userService - невервый код
    });

    it('вернуть токен если пароль верный', async () => {
        const mockedUser = {
            id: 1,
            checkCodePassword: jest.fn(() => Promise.resolve(true))
        };
        usersRepository.findOne.mockResolvedValue(mockedUser);
        const res = await service.login(loginArgs);
        expect(jwtService.sign).toHaveBeenCalledTimes(1)
        expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number))
        expect(res).toEqual({ ok: true, token: 'signed-token'})
    })
  });

  describe('findById', () => {
    const findByIdArgs = {
      id: 1
    }

    it('должен существовать пользователь', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1)
      expect(result).toEqual({ ok: true, user: findByIdArgs })
    });

    it('должена быть ошибка если пользователя не существует', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1)
      expect(result).toEqual({ ok: false, error: 'Пользователь не найден.'})
    });
  })

  describe('editProfile', () => {
    it('следует сменить телефон', async () => {
      const oldUser = {
        phone: '+79999999999',
        verified: true
      };
      const editProfileArgs = {
        userId: 1,
        input: {
          phone: '+79999999999'
        }
      };
      const newVerification = {
        code: 1234
      }
      const newUser = {
        verified: false,
        phone: editProfileArgs.input.phone
      }

      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationsRepository.create.mockReturnValue(newVerification);
      verificationsRepository.save.mockResolvedValue(newVerification);

      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1)
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        editProfileArgs.userId
      );

      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: newUser
      });
      expect(verificationsRepository.save).toHaveBeenCalledWith(
        newVerification
      );
      
      expect(smsService.sendSms).toHaveBeenCalledWith(
        newUser.phone, 
        newVerification.code
      );
    });

    it('должен быть изменен пароль', async () => {
      const editProfileArgs = {
        userId: 1,
        input: {
          password: 'new.password'
        }
      };

      usersRepository.findOne.mockResolvedValue({ password: 'old' });
      const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.input)
      expect(usersRepository.save).toHaveBeenCalledTimes(1)
      expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
      expect(result).toEqual({ ok: true });
    });

    it('должен завершиться ошибкой при исключении', async () => {
    
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(1, { phone: '+79889998899'})
      expect(result).toEqual({ 
        ok: false,
        error: 'Не удалось обновить профиль.',
      })
    });
    
  });

  describe('verifyPhone', () => {
    it('должна пройти верификация', async () => {
      const mockedVerification = {
        user: {
          verified: true
        },
        id: 1
      }
      verificationsRepository.findOne.mockResolvedValue(mockedVerification)
      const result = await service.verifyPhone(null)
      expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.findOne).toHaveBeenCalledWith(
          expect.any(Object),
          expect.any(Object),
        );

        expect(usersRepository.save).toHaveBeenCalledTimes(1)
        expect(usersRepository.save).toHaveBeenCalledWith({ verified: true });
    
        // expect(usersRepository.delete).toHaveBeenCalledTimes(1)
        // expect(usersRepository.delete).toHaveBeenCalledWith(
        //   mockedVerification.id
        //   );

        expect(result).toEqual({ ok: true })  
      });
 
    it('должен завершиться ошибкой при верификации', async () => {
      verificationsRepository.findOne.mockResolvedValue(undefined)
      const result = await service.verifyPhone(null) 
      expect(result).toEqual({ ok: false, error: 'Аутентификация не пройдена.' }) 
    });
      
    it('должен завершиться ошибкой при исключении', async () => {
      verificationsRepository.findOne.mockRejectedValue(new Error())
      const result = await service.verifyPhone(null) 
      expect(result).toEqual({ ok: false, error: 'Телефон не верефицирован.' }) 
    });
    
   
  });
});
