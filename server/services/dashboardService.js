import AuditLog from '../models/AuditLog.js'
import Category from '../models/Category.js'
import ContactEnquiry from '../models/ContactEnquiry.js'
import MediaAsset from '../models/MediaAsset.js'
import Project from '../models/Project.js'

export async function getDashboardSummary() {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    archivedProjects,
    totalCategories,
    totalMediaAssets,
    totalEnquiries,
    newEnquiries,
    recentEnquiries,
    recentAuditLogs,
  ] = await Promise.all([
    Project.countDocuments(),

    Project.countDocuments({
      status: 'published',
    }),

    Project.countDocuments({
      status: 'draft',
    }),

    Project.countDocuments({
      status: 'archived',
    }),

    Category.countDocuments(),

    MediaAsset.countDocuments({
      isActive: true,
    }),

    ContactEnquiry.countDocuments(),

    ContactEnquiry.countDocuments({
      status: 'new',
    }),

    ContactEnquiry.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        'name email subject status createdAt',
      )
      .lean(),

    AuditLog.find()
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .populate(
        'actor',
        'name email',
      )
      .lean(),
  ])

  return {
    projects: {
      total: totalProjects,
      published: publishedProjects,
      draft: draftProjects,
      archived: archivedProjects,
    },

    categories: {
      total: totalCategories,
    },

    media: {
      total: totalMediaAssets,
    },

    enquiries: {
      total: totalEnquiries,
      new: newEnquiries,
    },

    recentEnquiries,

    recentActivity:
      recentAuditLogs,
  }
}