import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../users/dto/user-login.dto';
import { UserRegisterDto } from '../users/dto/user-register.dto';

export interface IUserService {
  createUser(dto: UserRegisterDto): Promise<UserModel | null>;
  ensureIsValid(dto: UserLoginDto): Promise<boolean>;
}
