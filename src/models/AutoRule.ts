import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAutoRule extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  instructions: string;
  attachmentUrl?: string;
  createdAt: Date;
}

const autoRuleSchema = new Schema<IAutoRule>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  instructions: { type: String, required: true },
  attachmentUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const AutoRule: Model<IAutoRule> = mongoose.models.AutoRule || mongoose.model<IAutoRule>('AutoRule', autoRuleSchema);
export default AutoRule;
