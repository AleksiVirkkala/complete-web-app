import { Document, Schema, model, Model } from 'mongoose';

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    snippet: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

interface IBlog extends Document {
  title: string;
  snippet: string;
  body: string;
}

export default model('Blog', blogSchema) as Model<IBlog>;
