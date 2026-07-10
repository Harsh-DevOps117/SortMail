import mongoose, { Schema, Document } from 'mongoose';

export interface IBulkHistory extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  targetCount: number;
  type: string;
  createdAt: Date;
}

const bulkHistorySchema = new Schema<IBulkHistory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  targetCount: { type: Number, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.BulkHistory || mongoose.model<IBulkHistory>('BulkHistory', bulkHistorySchema);
