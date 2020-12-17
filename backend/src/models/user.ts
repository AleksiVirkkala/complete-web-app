import { Document, Schema, model, Model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

interface IUser extends Document {
  name: String;
  email: String;
  password: String;
}

export default model('User', userSchema) as Model<IUser>;
