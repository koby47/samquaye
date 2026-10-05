import mongoose from 'mongoose'

const contactEnquirySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
      },

      subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
      },

      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },

      status: {
        type: String,
        enum: [
          'new',
          'read',
          'replied',
          'archived',
        ],
        default: 'new',
        required: true,
      },

      readAt: {
        type: Date,
        default: null,
      },

      repliedAt: {
        type: Date,
        default: null,
      },

      archivedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    },
  )

contactEnquirySchema.index({
  status: 1,
  createdAt: -1,
})

contactEnquirySchema.index({
  createdAt: -1,
})

const ContactEnquiry =
  mongoose.model(
    'ContactEnquiry',
    contactEnquirySchema,
  )

export default ContactEnquiry