import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  autoReplyRules: Array<{
    category: string;
    isActive: boolean;
  }>;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  autoReplyRules: [{
    category: { type: String },
    isActive: { type: Boolean, default: true }
  }]
}, {
  timestamps: true 
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
