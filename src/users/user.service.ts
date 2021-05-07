import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create({ ...dto });
    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async getOne(id: ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async delete(id: ObjectId): Promise<string> {
    const user = await this.userModel.findByIdAndDelete(id);
    return `Профиль "${user.email}" удален`;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email: email })
      .select('+password');
    return user;
  }

  async updateProfile({ id, data }): Promise<User> {
    const hashPassword = await bcrypt.hash(data.password, 5);
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          name: data.name,
          password: hashPassword,
        },
        {
          new: true, // обработчик then получит на вход обновлённую запись
          runValidators: true, // данные будут валидированы перед изменением
        },
      )
      .orFail(new NotFoundException('Пользователь не найден'));
    return user;
  }
}
