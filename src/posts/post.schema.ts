import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.schema';
import { Comment } from '../comments/comment.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  _id: mongoose.ObjectId;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 300,
  })
  title: string;

  @Prop({
    required: true,
    minlength: 1,
    maxlength: 300000,
  })
  text: string;

  @Prop({
    maxlength: 300000,
  })
  image: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  likes: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  })
  comments: Comment[];

  @Prop()
  publication: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
