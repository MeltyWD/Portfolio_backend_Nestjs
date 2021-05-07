import { ObjectId } from 'mongoose';

export class CreateCommentDto {
  readonly text: string;
  readonly owner: ObjectId;
  readonly post: ObjectId;
}
