import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: number;
  active: boolean;
  comparePassword(enteredPassword: string): Promise<boolean>;
  signAccessToken(): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Please enter a valid email",
    },
  },
  password: { type: String, required: true, select: false },
  role: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.signAccessToken = function (): string {
  return jwt.sign({ id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '30d' });
};

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;
