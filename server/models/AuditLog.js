import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    resourceType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  },
)

auditLogSchema.index({
  actor: 1,
  createdAt: -1,
})

auditLogSchema.index({
  resourceType: 1,
  resourceId: 1,
  createdAt: -1,
})

auditLogSchema.index({
  action: 1,
  createdAt: -1,
})

const AuditLog = mongoose.model(
  'AuditLog',
  auditLogSchema,
)

export default AuditLog