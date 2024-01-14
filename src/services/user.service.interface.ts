import { UserLoginDto } from '../users/dto/user-login.dto';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { User } from '../users/entity/User';

export interface IUserService {
  createUser(dto: UserRegisterDto): Promise<User | null>
  ensureIsValid(dto: UserLoginDto): Promise<boolean>;
}
