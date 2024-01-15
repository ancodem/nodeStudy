// buisness entity that represents a business related item and that is separated from other logic
import { hash } from 'bcryptjs';

export class User {
  private _password: string;

  constructor(
    private readonly _name: string,
    private readonly _email: string,
  ) {}

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  async setPassword(pass: string, salt: number): Promise<void> {
    this._password = await hash(pass, salt);
  }
}
