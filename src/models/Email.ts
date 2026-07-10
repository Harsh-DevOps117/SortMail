import mongoose, { Schema, Document } from 'mongoose';

export interface IEmail extends Document {
  messageId: string;
  threadId: string;
  userId: mongoose.Types.ObjectId;
  senderEmail: string;
  senderName: string;
  subject: string;
  snippet: string;
  htmlBody?: string;
  category: 'internship' | 'youtube' | 'newsletter' | 'personal' | 'social' | 'finance' | 'scam' | 'security' | 'other';
  needsReply: boolean;
  receivedAt: Date;
  isAutoReplied: boolean;
}

const EmailSchema: Schema = new Schema({
  messageId: { type: String, required: true, unique: true },
  threadId: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderEmail: { type: String, required: true },
  senderName: { type: String },
  subject: { type: String },
  snippet: { type: String },
  htmlBody: { type: String },
  category: { 
    type: String, 
    enum: ['internship', 'youtube', 'newsletter', 'personal', 'social', 'finance', 'scam', 'security', 'other'],
    default: 'other'
  },
  needsReply: { type: Boolean, default: false },
  receivedAt: { type: Date, default: Date.now },
  isAutoReplied: { type: Boolean, default: false }
}, {
  timestamps: true 
});

EmailSchema.index({ userId: 1, category: 1, receivedAt: -1 });

export default mongoose.models.Email || mongoose.model<IEmail>('Email', EmailSchema);
