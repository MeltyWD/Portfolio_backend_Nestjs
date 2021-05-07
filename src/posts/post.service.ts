import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const post = await this.postModel.create(dto);
    await this.userModel.findByIdAndUpdate(
      dto.owner,
      { $addToSet: { posts: post._id } },
      { new: true },
    );
    return post;
  }

  async getAll(): Promise<Post[]> {
    const posts = await this.postModel.find().populate('owner');
    return posts;
  }

  async getOne(id: ObjectId): Promise<Post> {
    const post = await this.postModel.findById(id);
    return post;
  }

  async delete({ id, userId }): Promise<string> {
    const findPost = await this.postModel
      .findById(id)
      .orFail(new NotFoundException('Пост не найден'));
    if (findPost.owner.toString() !== userId) {
      throw new ForbiddenException('Нет прав на удаление');
    }
    const deletePost = await this.postModel.findByIdAndDelete(id);
    return `Пост "${deletePost.title}" удален`;
  }
}
