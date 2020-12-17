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

interface IUser extends Document {
  name: String;
  email: String;
  password: String;
}

// Always hash passwords before save
userSchema.pre<IUser>('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default model('User', userSchema) as Model<IUser>;
