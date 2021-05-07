import { ObjectId } from 'mongoose';

export class CreatePostDto {
  readonly title: string;
  readonly text: string;
  readonly image: string;
  readonly owner: ObjectId;
}
