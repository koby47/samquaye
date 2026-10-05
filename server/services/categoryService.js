import Category from '../models/Category.js'
import Project from '../models/Project.js'

export async function createCategory(data) {
  const existingCategory = await Category.findOne({
    $or: [
      { name: data.name },
      { slug: data.slug },
    ],
  })

  if (existingCategory) {
    const error = new Error(
      'A category with that name or slug already exists.',
    )
    error.status = 409
    throw error
  }

  return Category.create(data)
}

export async function getActiveCategories() {
  return Category.find({
    isActive: true,
  })
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean()
}

export async function getAllCategories() {
  return Category.find()
    .sort({
      sortOrder: 1,
      name: 1,
    })
    .lean()
}

export async function updateCategory(
  categoryId,
  data,
) {
  const category = await Category.findById(
    categoryId,
  )

  if (!category) {
    const error = new Error('Category not found.')
    error.status = 404
    throw error
  }

  if (data.name || data.slug) {
    const duplicateConditions = []

    if (data.name) {
      duplicateConditions.push({
        name: data.name,
      })
    }

    if (data.slug) {
      duplicateConditions.push({
        slug: data.slug,
      })
    }

    const duplicate = await Category.findOne({
      _id: {
        $ne: categoryId,
      },
      $or: duplicateConditions,
    })

    if (duplicate) {
      const error = new Error(
        'A category with that name or slug already exists.',
      )
      error.status = 409
      throw error
    }
  }

  Object.assign(category, data)

  await category.save()

  return category
}

export async function deleteCategory(categoryId) {
  const category = await Category.findById(
    categoryId,
  )

  if (!category) {
    const error = new Error('Category not found.')
    error.status = 404
    throw error
  }

  const projectUsesCategory =
    await Project.exists({
      category: categoryId,
    })

  if (projectUsesCategory) {
    const error = new Error(
      'Category cannot be deleted while projects reference it.',
    )
    error.status = 409
    throw error
  }

  await category.deleteOne()

  return category
}