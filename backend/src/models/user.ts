import { Document, Schema, model, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter an name']
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter an valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minlength: [6, 'Minimum password length is 6 characters']
  }
});

export interface User {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends User, Document {
  passwordEquals(password: string): Promise<boolean>;
}
export type UserModel = Model<UserDocument>;

// Always hash passwords before save
userSchema.pre<UserDocument>('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.passwordEquals = async function (this: UserDocument, password: string) {
  return await bcrypt.compare(password, this.password);
};

export default model<UserDocument, UserModel>('User', userSchema);
