import { Request } from 'express';
import { ObjectId } from 'mongoose';
export interface GetUserAuthInfoRequest extends Request {
  user: {
    _id: ObjectId;
  };
}
