import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

const cookieSetting = {
  maxAge: 3600000 * 24 * 7,
  httpOnly: true,
  sameSite: true,
};

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signin')
  async login(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.login(userDto);
    response.cookie('jwt', data.token, cookieSetting);
    return data.user;
  }

  @Post('/signup')
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.registration(userDto);
    response.cookie('jwt', data.token, cookieSetting);
    return data.user;
  }

  @Post('/signout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return { message: 'logout' };
  }
}
