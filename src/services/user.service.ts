import { UserLoginDto } from '../users/dto/user-login.dto';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { User } from '../users/entity/User';
import { IUserService } from './user.service.interface';
import { injectable } from 'inversify';

@injectable()
export class UserService implements IUserService {
  async createUser({ login, email, password }: UserRegisterDto): Promise<User | null> {
    const newcommer = new User(login, email);
    await newcommer.setPassword(password);
    // if newcommer exists return newcommer
    // else return null
    return newcommer;
  }

  async ensureIsValid(_dto: UserLoginDto): Promise<boolean> {
    return true;
  }
}
