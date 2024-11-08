import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  description: string;
  type: "001" | "002";
  t1: string;
  t2: string;
  t3: string;
}

const categorySchema: Schema<ICategory> = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, default: "001" },
  t1: { type: String },
  t2: { type: String },
  t3: { type: String },
}, { timestamps: true });

const CategoryModel: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default CategoryModel;
