import {
  createContactEnquiry,
  deleteContactEnquiry as deleteContactEnquiryService,
  getContactEnquiries,
  getContactEnquiryById,
  updateContactEnquiryStatus,
} from '../services/contactService.js'

import { createAuditLog } from '../services/auditService.js'

import {
  verifyTurnstileToken,
} from '../services/turnstileService.js'

import {
  createContactEnquirySchema,
  updateContactEnquirySchema,
} from '../validators/contactValidator.js'

import {
  mongoIdSchema,
} from '../validators/commonValidator.js'

/* -------------------------------------------------- */
/* PUBLIC: SUBMIT CONTACT FORM                        */
/* -------------------------------------------------- */

export async function submitContactEnquiry(
  req,
  res,
  next,
) {
  try {
    const validation =
      createContactEnquirySchema.safeParse(
        req.body,
      )

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid contact form data.',
      })
    }

    const {
      turnstileToken,
      ...enquiryData
    } = validation.data

    await verifyTurnstileToken(
      turnstileToken,
    )

    await createContactEnquiry(
      enquiryData,
    )

    return res.status(201).json({
      success: true,
      message:
        'Your message has been received successfully.',
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: LIST ENQUIRIES                              */
/* -------------------------------------------------- */

export async function listContactEnquiries(
  req,
  res,
  next,
) {
  try {
    const filters = {}

    if (req.query.status) {
      const allowedStatuses = [
        'new',
        'read',
        'replied',
        'archived',
      ]

      if (
        !allowedStatuses.includes(
          req.query.status,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid enquiry status.',
        })
      }

      filters.status =
        req.query.status
    }

    const enquiries =
      await getContactEnquiries(
        filters,
      )

    return res.status(200).json({
      success: true,
      enquiries,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: GET ENQUIRY                                 */
/* -------------------------------------------------- */

export async function getContactEnquiry(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(
        req.params.id,
      )

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid contact enquiry identifier.',
      })
    }

    const enquiry =
      await getContactEnquiryById(
        idValidation.data,
      )

    return res.status(200).json({
      success: true,
      enquiry,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: UPDATE STATUS                               */
/* -------------------------------------------------- */

export async function updateContactEnquiry(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(
        req.params.id,
      )

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid contact enquiry identifier.',
      })
    }

    const validation =
      updateContactEnquirySchema.safeParse(
        req.body,
      )

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid contact enquiry data.',
      })
    }

    const enquiry =
      await updateContactEnquiryStatus(
        idValidation.data,
        validation.data.status,
      )

    await createAuditLog({
      actor: req.admin._id,
      action:
        'contact_enquiry.status_updated',
      resourceType:
        'ContactEnquiry',
      resourceId:
        enquiry._id,
      metadata: {
        status:
          enquiry.status,
      },
    })

    return res.status(200).json({
      success: true,
      message:
        'Contact enquiry updated successfully.',
      enquiry,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: DELETE ENQUIRY                              */
/* -------------------------------------------------- */

export async function deleteContactEnquiry(
  req,
  res,
  next,
) {
  try {
    const idValidation =
      mongoIdSchema.safeParse(
        req.params.id,
      )

    if (!idValidation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid contact enquiry identifier.',
      })
    }

    const enquiry =
      await deleteContactEnquiryService(
        idValidation.data,
      )

    await createAuditLog({
      actor: req.admin._id,
      action:
        'contact_enquiry.deleted',
      resourceType:
        'ContactEnquiry',
      resourceId:
        enquiry._id,
      metadata: {
        status:
          enquiry.status,
      },
    })

    return res.status(200).json({
      success: true,
      message:
        'Contact enquiry deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}