import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItem extends Document {
	user: Schema.Types.ObjectId;
	category: Schema.Types.ObjectId;
	title: string;
	type: "001" | "002";
	amount: number;
	remark: string;
	t1: string;
	t2: string;
	t3: string;
    createdAt: Date;
    updatedAt: Date;
}

const itemSchema: Schema<IItem> = new mongoose.Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		category: {
			type: Schema.Types.ObjectId,
            ref: "Category",
			required: true,
		},
		title: { type: String, required: true },
		type: { type: String, required: true },
		amount: { type: Number, default: 0 },
		remark: { type: String },
		t1: { type: String },
		t2: { type: String },
		t3: { type: String },
        createdAt: { type: Date },
        updatedAt: { type: Date },
	},
);

const ItemModel: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>("Item", itemSchema);

export default ItemModel;
