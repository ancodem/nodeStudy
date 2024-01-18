import { UserModel } from '@prisma/client';
import { IUserService } from './user.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUserRepository } from '../repository/user.repository.interface';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/User';
import { UserLoginDto } from '../dto/user-login.dto';
import { EnvKeyFor } from '../../constants/config';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}
  async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
    const newcommer = new User(name, email);
    const salt = +this.configService.get(EnvKeyFor.SALT);
    await newcommer.setPassword(password, salt);
    const existingUser = await this.userRepository.find(email);
    if (existingUser) {
      return null;
    }

    return this.userRepository.create(newcommer);
  }

  async ensureIsValid({ email, password }: UserLoginDto): Promise<boolean> {
    const existingUser = await this.userRepository.find(email);
    if (!existingUser) {
      return false;
    }

    return User.validatePassword(password, existingUser.password);
  }
}
