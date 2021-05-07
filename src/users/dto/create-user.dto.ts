import { ObjectId } from 'mongoose';
import { IsString, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  readonly _id: ObjectId;
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 30, {
    message: 'Пароль должен быть не короче 8 и не длиннее 30 символов',
  })
  readonly password: string;
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;
}
