import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUserAuthInfoRequest } from 'src/posts/requestSetting';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.userService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Req() request: GetUserAuthInfoRequest) {
    return this.userService.delete(request.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateProfile(
    @Body() dto: CreateUserDto,
    @Req() request: GetUserAuthInfoRequest,
  ) {
    return this.userService.updateProfile({ id: request.user._id, data: dto });
  }
}
