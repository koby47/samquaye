import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
   title: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  maxlength: 150,
},

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    problem: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: '',
    },

    solution: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },

    role: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },

    technologies: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      default: [],
    },

    features: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 300,
        },
      ],
      default: [],
    },

    architecture: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },

    challenges: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 1000,
        },
      ],
      default: [],
    },

    outcomes: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 1000,
        },
      ],
      default: [],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    coverImage: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'MediaAsset',
  default: null,
},

gallery: {
  type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MediaAsset',
    },
  ],
  default: [],
},
    repositoryUrl: {
      type: String,
      trim: true,
      default: '',
    },

    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },

    featured: {
      type: Boolean,
      default: false,
      required: true,
    },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    seo: {
      title: {
        type: String,
        trim: true,
        maxlength: 70,
        default: '',
      },

      description: {
        type: String,
        trim: true,
        maxlength: 170,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  },
)

projectSchema.index({
  status: 1,
  featured: 1,
  sortOrder: 1,
})

projectSchema.index({
  category: 1,
  status: 1,
})

const Project = mongoose.model(
  'Project',
  projectSchema,
)

export default Project