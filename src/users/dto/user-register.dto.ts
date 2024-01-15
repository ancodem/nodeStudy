import { IsEmail, IsString } from 'class-validator';

// data transfer object to work with received data
export class UserRegisterDto {
  @IsString({ message: 'Имя не указано' })
  name: string;
  @IsEmail({}, { message: 'Неверно указан имейл' })
  email: string;
  @IsString({ message: 'Не указан пароль' })
  password: string;
}
