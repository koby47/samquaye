import Category from '../models/Category.js'
import MediaAsset from '../models/MediaAsset.js'
import Project from '../models/Project.js'

function createServiceError(message, status) {
  const error = new Error(message)
  error.status = status
  return error
}

async function validateCategory(categoryId) {
  const category = await Category.findById(
    categoryId,
  )

  if (!category) {
    throw createServiceError(
      'Selected category does not exist.',
      400,
    )
  }

  if (!category.isActive) {
    throw createServiceError(
      'Selected category is inactive.',
      400,
    )
  }

  return category
}
async function validateProjectMedia(
  coverImage,
  gallery,
) {
  const mediaIds = [
    ...(coverImage ? [coverImage] : []),
    ...(gallery || []),
  ]

 const uniqueMediaIds = [
  ...new Set(
    mediaIds.map((id) => id.toString()),
  ),
]

  if (uniqueMediaIds.length === 0) {
    return
  }

  const mediaAssets = await MediaAsset.find({
    _id: {
      $in: uniqueMediaIds,
    },
    isActive: true,
  })

  if (
    mediaAssets.length !== uniqueMediaIds.length
  ) {
    throw createServiceError(
      'One or more selected media assets do not exist or are inactive.',
      400,
    )
  }

  const containsNonImage =
    mediaAssets.some(
      (asset) => asset.mediaType !== 'image',
    )

  if (containsNonImage) {
    throw createServiceError(
      'Project media must contain image assets only.',
      400,
    )
  }
}

async function ensureProjectUnique(
  title,
  slug,
  excludeProjectId = null,
) {
  const conditions = []

  if (title) {
    conditions.push({
      title,
    })
  }

  if (slug) {
    conditions.push({
      slug,
    })
  }

  if (conditions.length === 0) {
    return
  }

  const query = {
    $or: conditions,
  }

  if (excludeProjectId) {
    query._id = {
      $ne: excludeProjectId,
    }
  }

  const existingProject =
    await Project.findOne(query)

  if (existingProject) {
    throw createServiceError(
      'A project with that title or slug already exists.',
      409,
    )
  }
}

export async function createProject(data) {
  await ensureProjectUnique(
    data.title,
    data.slug,
  )

  await validateCategory(data.category)

  await validateProjectMedia(
    data.coverImage,
    data.gallery,
  )

  const projectData = {
    ...data,
  }

  if (projectData.status === 'published') {
    projectData.publishedAt = new Date()
  }

  return Project.create(projectData)
}

export async function getPublishedProjects({
  featured,
  category,
} = {}) {
  const query = {
    status: 'published',
  }

  if (typeof featured === 'boolean') {
    query.featured = featured
  }

  if (category) {
    query.category = category
  }

  return Project.find(query)
    .populate(
      'category',
      'name slug description',
    )
    .populate(
      'coverImage',
      'filename publicUrl altText width height',
    )
    .sort({
      sortOrder: 1,
      publishedAt: -1,
    })
    .lean()
}
export async function getPublishedProjectBySlug(
  slug,
) {
  const project = await Project.findOne({
    slug,
    status: 'published',
  })
    .populate(
      'category',
      'name slug description',
    )
    .populate(
      'coverImage',
      'filename publicUrl altText width height',
    )
    .populate(
      'gallery',
      'filename publicUrl altText width height',
    )
    .lean()

  if (!project) {
    throw createServiceError(
      'Project not found.',
      404,
    )
  }

  return project
}

export async function getAllProjects() {
  return Project.find()
    .populate(
      'category',
      'name slug isActive',
    )
    .populate(
      'coverImage',
      'filename publicUrl altText width height',
    )
    .sort({
      updatedAt: -1,
    })
    .lean()
}
export async function getProjectById(
  projectId,
) {
  const project = await Project.findById(
    projectId,
  )
    .populate(
      'category',
      'name slug isActive',
    )
    .populate(
      'coverImage',
      'filename publicUrl altText width height',
    )
    .populate(
      'gallery',
      'filename publicUrl altText width height',
    )
    .lean()

  if (!project) {
    throw createServiceError(
      'Project not found.',
      404,
    )
  }

  return project
}

export async function updateProject(
  projectId,
  data,
) {
  const project = await Project.findById(
    projectId,
  )

  if (!project) {
    throw createServiceError(
      'Project not found.',
      404,
    )
  }

  await ensureProjectUnique(
    data.title,
    data.slug,
    projectId,
  )

  if (data.category) {
    await validateCategory(data.category)
  }

  const nextCoverImage =
    data.coverImage !== undefined
      ? data.coverImage
      : project.coverImage

  const nextGallery =
    data.gallery !== undefined
      ? data.gallery
      : project.gallery

  if (
    data.coverImage !== undefined ||
    data.gallery !== undefined
  ) {
    await validateProjectMedia(
      nextCoverImage,
      nextGallery,
    )
  }

  const previousStatus = project.status

  Object.assign(project, data)

  if (
    previousStatus !== 'published' &&
    project.status === 'published'
  ) {
    project.publishedAt = new Date()
  }

  if (
    previousStatus === 'published' &&
    project.status === 'draft'
  ) {
    project.publishedAt = null
  }

  await project.save()

  return project
}

export async function deleteProject(
  projectId,
) {
  const project = await Project.findById(
    projectId,
  )

  if (!project) {
    throw createServiceError(
      'Project not found.',
      404,
    )
  }

  await project.deleteOne()

  return project
}