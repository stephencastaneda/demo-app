import { Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  facebookOAuthToken: string;
  facebookRefreshToken: string;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  facebookOAuthToken: { type: String },
  facebookRefreshToken: { type: String },
});

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const UserModel = model<UserDocument>('User', UserSchema);

