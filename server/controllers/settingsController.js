import {
  getAdminSettings,
  getPublicSettings,
  updateSettings,
} from '../services/settingsService.js'

import { createAuditLog } from '../services/auditService.js'

import {
  updatePortfolioSettingsSchema,
} from '../validators/settingsValidator.js'

/* -------------------------------------------------- */
/* PUBLIC: GET PORTFOLIO SETTINGS                     */
/* -------------------------------------------------- */

export async function getPublicPortfolioSettings(
  req,
  res,
  next,
) {
  try {
    const settings =
      await getPublicSettings()

    return res.status(200).json({
      success: true,
      settings,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: GET PORTFOLIO SETTINGS                      */
/* -------------------------------------------------- */

export async function getAdminPortfolioSettings(
  req,
  res,
  next,
) {
  try {
    const settings =
      await getAdminSettings()

    return res.status(200).json({
      success: true,
      settings,
    })
  } catch (error) {
    next(error)
  }
}

/* -------------------------------------------------- */
/* ADMIN: UPDATE PORTFOLIO SETTINGS                   */
/* -------------------------------------------------- */

export async function updatePortfolioSettings(
  req,
  res,
  next,
) {
  try {
    const validation =
      updatePortfolioSettingsSchema.safeParse(
        req.body,
      )

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid portfolio settings data.',
      })
    }

    const settings =
      await updateSettings(
        validation.data,
      )

    await createAuditLog({
      actor: req.admin._id,

      action:
        'portfolio.settings_updated',

      resourceType:
        'PortfolioSettings',

      resourceId:
        settings._id,

      metadata: {
        updatedFields:
          Object.keys(
            validation.data,
          ),
      },
    })

    return res.status(200).json({
      success: true,

      message:
        'Portfolio settings updated successfully.',

      settings,
    })
  } catch (error) {
    next(error)
  }
}