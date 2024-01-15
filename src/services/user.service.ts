import { EnvKeyFor } from '../config/config.service';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { User } from '../users/entity/User';
import { IUserService } from './user.service.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.ConfigService) private configService: IConfigService) { }
  async createUser({ login, email, password }: UserRegisterDto): Promise<User | null> {
    const newcommer = new User(login, email);
    const salt = +this.configService.get(EnvKeyFor.SALT);
    await newcommer.setPassword(password, salt);
    // if newcommer exists return newcommer
    // else return null
    return newcommer;
  }

  async ensureIsValid(_dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
