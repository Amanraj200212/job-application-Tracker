//we make collection Column to store data in mongodb

import mongoose, { Schema } from "mongoose";

export interface IColumn extends Document{
  name: string;
  boardId : mongoose.Types.ObjectId;
  order: number;
  jobApplications: mongoose.Types.ObjectId[]; //list of object Id
  createdAt: Date;
  updatedAt: Date;
}

// Board -> columns -> job-aplpication

const ColumnSchema = new Schema <IColumn>({
  name: {
    type: String,
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId, // mongodb use this as default data type
    ref: "Board",
    required: true,
    index: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  jobApplications: [
    {
      type: Schema.Types.ObjectId,
      ref: "JobApplication",
    },
  ],
},
{
  timestamps: true,
});

export default mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema);