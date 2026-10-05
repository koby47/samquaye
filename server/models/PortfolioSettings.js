import mongoose from 'mongoose'

const portfolioSettingsSchema =
  new mongoose.Schema(
    {
      siteName: {
        type: String,
        trim: true,
        maxlength: 100,
        default: 'Samuel Mensah Quaye',
      },

      headline: {
        type: String,
        trim: true,
        maxlength: 200,
        default:
          'Software Developer | Full-Stack Developer',
      },

      shortBio: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: '',
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 254,
        default: '',
      },

      location: {
        type: String,
        trim: true,
        maxlength: 150,
        default: '',
      },

      socialLinks: {
        github: {
          type: String,
          trim: true,
          default: '',
        },

        linkedin: {
          type: String,
          trim: true,
          default: '',
        },
      },

      cv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MediaAsset',
        default: null,
      },

      profileImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MediaAsset',
        default: null,
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

const PortfolioSettings =
  mongoose.model(
    'PortfolioSettings',
    portfolioSettingsSchema,
  )

export default PortfolioSettings