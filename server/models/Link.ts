import { Schema, model, Document } from 'mongoose';

export interface ILink extends Document {
  title: string;
  url: string;
}

const linkSchema = new Schema<ILink>({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default model<ILink>('Link', linkSchema);