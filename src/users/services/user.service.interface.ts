import { UserModel } from '@prisma/client';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';

export interface IUserService {
  createUser(dto: UserRegisterDto): Promise<UserModel | null>;
  getUser(email: string): Promise<UserModel | null>;
  ensureIsValid(dto: UserLoginDto): Promise<boolean>;
}
