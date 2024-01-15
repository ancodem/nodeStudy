import { UserModel } from '@prisma/client';
import { EnvKeyFor } from '../config/config.service';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { User } from '../users/entity/User';
import { IUserRepository } from '../users/repository/user.repository.interface';
import { IUserService } from './user.service.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) { }
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

  async ensureIsValid(_dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
