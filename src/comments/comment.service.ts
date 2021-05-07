import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment, CommentDocument } from './comment.schema';
import { Post, PostDocument } from 'src/posts/post.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const comment = await this.commentModel.create(dto);
    await this.userModel.findByIdAndUpdate(
      dto.owner,
      { $addToSet: { comments: comment._id } },
      { new: true },
    );
    await this.postModel.findByIdAndUpdate(
      dto.post,
      { $addToSet: { comments: comment._id } },
      { new: true },
    );
    return comment;
  }

  async getAll(): Promise<Comment[]> {
    const comments = await this.commentModel.find().populate('owner');
    return comments;
  }

  async getOne(id: ObjectId): Promise<Comment> {
    const comment = await this.commentModel.findById(id);
    return comment;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const deleteComment = await this.commentModel.findByIdAndDelete(id);
    return deleteComment._id;
  }
}
