import { inject, injectable } from 'inversify';
import { IUserRepository } from './user.repository.interface';
import { TYPES } from '../../types';
import { PrismaService } from '../../database/prisma.service';
import { User } from '../entity/User';
import { UserModel } from '@prisma/client';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.PrismaService) private database: PrismaService) { }

  create(data: User): Promise<UserModel> {
    return this.database.client.userModel.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });
  }

  find(email: string): Promise<UserModel | null> {
    return this.database.client.userModel.findFirst({ where: { email } });
  }
}
