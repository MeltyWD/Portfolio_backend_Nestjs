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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { GetUserAuthInfoRequest } from './requestSetting';

@Controller('/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() dto: CreateCommentDto,
    @Req() request: GetUserAuthInfoRequest,
  ) {
    const owner = request.user._id;
    const comment = await this.commentService.create({ ...dto, owner });
    return comment;
  }

  @Get()
  getAll() {
    return this.commentService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.commentService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.commentService.delete(id);
  }
}
