import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import validator from 'validator';
import { Post } from '../posts/post.schema';
import { Comment } from '../comments/comment.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: mongoose.ObjectId;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator(data) {
        return validator.isEmail(data);
      },
    },
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  password: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 30 })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts: Post[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  liked: Post[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  })
  comments: Comment[];
}

export const UserSchema = SchemaFactory.createForClass(User);
