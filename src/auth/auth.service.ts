import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.dataFormating(user);
  }

  async registration(userDto: CreateUserDto) {
    const findConflictUser = await this.userService.getUserByEmail(
      userDto.email,
    );
    if (findConflictUser) {
      throw new HttpException(
        'Пользователь с таким email уже существует',
        HttpStatus.CONFLICT,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });
    return this.dataFormating(user);
  }

  private async generateToken(user: User) {
    const payload = { _id: user._id };
    return this.jwtService.sign(payload);
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Неправильный логин или пароль',
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    } else {
      throw new UnauthorizedException({
        message: 'Неправильный логин или пароль',
      });
    }
  }

  private async dataFormating(user: User) {
    const token = await this.generateToken(user);
    const userWithoutPassword = await this.userService.getOne(user._id);
    return { user: userWithoutPassword, token };
  }
}
