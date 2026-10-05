import mongoose from 'mongoose'

const mediaAssetSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    originalFilename: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    objectKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    mediaType: {
      type: String,
      enum: ['image', 'document'],
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: Number,
      required: true,
      min: 1,
    },

    altText: {
      type: String,
      trim: true,
      maxlength: 250,
      default: '',
    },

    width: {
      type: Number,
      min: 1,
      default: null,
    },

    height: {
      type: Number,
      min: 1,
      default: null,
    },

    storageProvider: {
      type: String,
      enum: ['cloudflare-r2'],
      default: 'cloudflare-r2',
      required: true,
    },

    bucket: {
      type: String,
      required: true,
      trim: true,
    },

    publicUrl: {
      type: String,
      trim: true,
      default: '',
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

mediaAssetSchema.index({
  mediaType: 1,
  createdAt: -1,
})

mediaAssetSchema.index({
  uploadedBy: 1,
  createdAt: -1,
})

const MediaAsset = mongoose.model(
  'MediaAsset',
  mediaAssetSchema,
)

export default MediaAsset