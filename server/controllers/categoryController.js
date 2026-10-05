import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  getActiveCategories,
  getAllCategories,
  updateCategory as updateCategoryService,
} from '../services/categoryService.js'
import { createAuditLog } from '../services/auditService.js'
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/categoryValidator.js'
import { mongoIdSchema } from '../validators/commonValidator.js'

export async function listPublicCategories(
  req,
  res,
  next,
) {
  try {
    const categories =
      await getActiveCategories()

    return res.status(200).json({
      success: true,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

export async function listAdminCategories(
  req,
  res,
  next,
) {
  try {
    const categories =
      await getAllCategories()

    return res.status(200).json({
      success: true,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

export async function createCategory(
  req,
  res,
  next,
) {
  try {
    const validation =
      createCategorySchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category data.',
      })
    }

    const category =
      await createCategoryService(
        validation.data,
      )

    await createAuditLog({
      actor: req.admin._id,
      action: 'category.created',
      resourceType: 'Category',
      resourceId: category._id,
      metadata: {
        name: category.name,
        slug: category.slug,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category,
    })
  } catch (error) {
    next(error)
  }
}

export async function updateCategory(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(req.params.id)

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category identifier.',
      })
    }

    const validation =
      updateCategorySchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category data.',
      })
    }

    const category =
      await updateCategoryService(
        idValidation.data,
        validation.data,
      )

    await createAuditLog({
      actor: req.admin._id,
      action: 'category.updated',
      resourceType: 'Category',
      resourceId: category._id,
      metadata: {
        updatedFields: Object.keys(
          validation.data,
        ),
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category,
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteCategory(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(req.params.id)

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category identifier.',
      })
    }

    const category =
      await deleteCategoryService(
        idValidation.data,
      )

    await createAuditLog({
      actor: req.admin._id,
      action: 'category.deleted',
      resourceType: 'Category',
      resourceId: category._id,
      metadata: {
        name: category.name,
        slug: category.slug,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}