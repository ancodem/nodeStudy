import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUserService } from './user.service.interface';
import { UserService } from './user.service';
import { IUserRepository } from '../repository/user.repository.interface';
import { User } from '../entity/User';
import { UserModel } from '@prisma/client';

const container = new Container();

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

const CREDENTIALS = {
  email: 'damir@damir.ru',
  name: 'Damir',
  password: '123',
};

const SALT = 1;

beforeAll(() => {
  container.bind<IUserService>(TYPES.UserService).to(UserService);
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
  container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserRepositoryMock);

  userService = container.get<IUserService>(TYPES.UserService);
  userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  configService = container.get<IConfigService>(TYPES.ConfigService);
});

describe('User service', () => {
  it('should correctly create a user', async () => {
    configService.get = jest.fn().mockReturnValueOnce(SALT);
    userRepository.create = jest.fn().mockImplementationOnce((user: User): UserModel => {
      return {
        password: user.password,
        name: user.name,
        email: user.email,
        id: 1,
      };
    });

    const createdUser = await userService.createUser(CREDENTIALS);

    expect(createdUser).toBeDefined();
    expect(createdUser?.password).not.toEqual(1);
    expect(createdUser?.id).toBe(1);
  });

  it('returns null if the user already exists', async () => {
    configService.get = jest.fn().mockReturnValueOnce(1);
    userRepository.find = jest.fn().mockReturnValueOnce({ ...CREDENTIALS, id: 1 });

    const createdUser = await userService.createUser(CREDENTIALS);

    expect(createdUser).toBeNull();
  });

  it('gets a user if one exists', async () => {
    userRepository.find = jest.fn().mockImplementationOnce((email: string) => {
      return email === CREDENTIALS.email ? { ...CREDENTIALS, id: 1 } : null;
    });

    const user = await userService.getUser(CREDENTIALS.email);
    expect(user).toBeDefined();
  });

  it('returns null if no saved user found', async () => {
    userRepository.find = jest.fn().mockImplementationOnce((email: string) => {
      return email === CREDENTIALS.email ? { ...CREDENTIALS, id: 1 } : null;
    });

    const user = await userService.getUser('wrong@email.com');
    expect(user).toBeNull();
  });

  it('returns true if the password is correct', async () => {
    const user = new User(CREDENTIALS.name, CREDENTIALS.email);
    await user.setPassword(CREDENTIALS.password, SALT);

    userRepository.find = jest.fn().mockImplementationOnce((email: string) => {
      return email === CREDENTIALS.email
        ? { ...CREDENTIALS, password: user.password, id: 1 }
        : null;
    });

    const isValid = await userService.ensureIsValid({
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
    });

    expect(isValid).toBeTruthy();
  });

  it('returns false if the email is wrong', async () => {
    const user = new User(CREDENTIALS.name, CREDENTIALS.email);
    await user.setPassword(CREDENTIALS.password, SALT);

    userRepository.find = jest.fn().mockImplementationOnce((email: string) => {
      return email === CREDENTIALS.email
        ? { ...CREDENTIALS, password: user.password, id: 1 }
        : null;
    });

    const isValid = await userService.ensureIsValid({
      email: 'wrong@password.com',
      password: CREDENTIALS.password,
    });

    expect(isValid).toBeFalsy();
  });

  it('returns false if the password is wrong', async () => {
    const user = new User(CREDENTIALS.name, CREDENTIALS.email);
    await user.setPassword(CREDENTIALS.password, SALT);

    userRepository.find = jest.fn().mockImplementationOnce((email: string) => {
      return email === CREDENTIALS.email
        ? { ...CREDENTIALS, password: user.password, id: 1 }
        : null;
    });

    const isValid = await userService.ensureIsValid({
      email: CREDENTIALS.email,
      password: 'wrongPassword',
    });

    expect(isValid).toBeFalsy();
  });

  it('returns false if there is no such user', async () => {
    const user = new User(CREDENTIALS.name, CREDENTIALS.email);
    await user.setPassword(CREDENTIALS.password, SALT);

    userRepository.find = jest.fn().mockReturnValueOnce(null);

    const isValid = await userService.ensureIsValid({
      email: CREDENTIALS.email,
      password: CREDENTIALS.password,
    });

    expect(isValid).toBeFalsy();
  });
});
