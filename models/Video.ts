import mongoose, { Schema, model, models } from "mongoose";

export const videodimensions = {
  width: { type: Number, required: true },
  height: { type: Number, required: true },
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  controls?: boolean;
  isPublic?: boolean;
  transformation?: {
    height?: number;
    width?: number;
    quality?: number;
    format?: string;
  };
  dimensions: typeof videodimensions;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  controls: { type: Boolean, default: true },
  isPublic: { type: Boolean, default: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, 
  transformation: {
    height: { type: Number, default: 1920 },
    width: { type: Number, default: 1080 },
    quality: { type: Number, min: 1, max: 100, default: 75 },
  },
}, { timestamps: true });


const Video = models.Video || model<IVideo>("Video", videoSchema);

export default Video;
