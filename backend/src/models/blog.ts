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

export interface Blog {
  title: string;
  snippet: string;
  body: string;
}

export interface BlogDocument extends Blog, Document {}
export type BlogModel = Model<BlogDocument>;

export default model<BlogDocument, BlogModel>('Blog', blogSchema);
