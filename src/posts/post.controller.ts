import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';
import { GetUserAuthInfoRequest } from './requestSetting';

@Controller('/posts')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreatePostDto,
    @Req() request: GetUserAuthInfoRequest,
  ) {
    const owner = request.user._id;
    const post = await this.postService.create({ ...dto, owner });
    return post;
  }

  @Get()
  getAll() {
    return this.postService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.postService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: ObjectId, @Req() request: GetUserAuthInfoRequest) {
    return this.postService.delete({ id: id, userId: request.user._id });
  }
}
