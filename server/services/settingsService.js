import MediaAsset from '../models/MediaAsset.js'
import PortfolioSettings from '../models/PortfolioSettings.js'

function createServiceError(
  message,
  status,
) {
  const error = new Error(message)
  error.status = status

  return error
}

/* -------------------------------------------------- */
/* DEFAULT SETTINGS                                   */
/* -------------------------------------------------- */

const DEFAULT_SETTINGS = {
  siteName: 'Samuel Mensah Quaye',

  headline:
    'Software Developer | Full-Stack Developer',

  shortBio: '',

  email: '',

  location: '',

  socialLinks: {
    github: '',
    linkedin: '',
  },

  cv: null,

  profileImage: null,

  seo: {
    title: '',
    description: '',
  },
}

/* -------------------------------------------------- */
/* GET OR CREATE SINGLETON SETTINGS                   */
/* -------------------------------------------------- */

async function getOrCreateSettings() {
  let settings =
    await PortfolioSettings.findOne()

  if (!settings) {
    settings =
      await PortfolioSettings.create(
        DEFAULT_SETTINGS,
      )
  }

  return settings
}

/* -------------------------------------------------- */
/* VALIDATE CV                                        */
/* -------------------------------------------------- */

async function validateCvAsset(
  mediaId,
) {
  if (mediaId === null) {
    return
  }

  const asset =
    await MediaAsset.findOne({
      _id: mediaId,
      isActive: true,
    })

  if (!asset) {
    throw createServiceError(
      'Selected CV media asset does not exist or is inactive.',
      400,
    )
  }

  if (
    asset.mediaType !== 'document' ||
    asset.mimeType !== 'application/pdf'
  ) {
    throw createServiceError(
      'CV must be a PDF document.',
      400,
    )
  }
}

/* -------------------------------------------------- */
/* VALIDATE PROFILE IMAGE                             */
/* -------------------------------------------------- */

async function validateProfileImage(
  mediaId,
) {
  if (mediaId === null) {
    return
  }

  const asset =
    await MediaAsset.findOne({
      _id: mediaId,
      isActive: true,
    })

  if (!asset) {
    throw createServiceError(
      'Selected profile image does not exist or is inactive.',
      400,
    )
  }

  if (asset.mediaType !== 'image') {
    throw createServiceError(
      'Profile image must be an image asset.',
      400,
    )
  }
}

/* -------------------------------------------------- */
/* PUBLIC SETTINGS                                    */
/* -------------------------------------------------- */

export async function getPublicSettings() {
  const settings =
    await getOrCreateSettings()

  await settings.populate([
    {
      path: 'cv',
      select:
        'filename originalFilename publicUrl mimeType size',
    },
    {
      path: 'profileImage',
      select:
        'filename publicUrl altText width height',
    },
  ])

  return settings
}

/* -------------------------------------------------- */
/* ADMIN SETTINGS                                     */
/* -------------------------------------------------- */

export async function getAdminSettings() {
  const settings =
    await getOrCreateSettings()

  await settings.populate([
    {
      path: 'cv',
    },
    {
      path: 'profileImage',
    },
  ])

  return settings
}

/* -------------------------------------------------- */
/* UPDATE SETTINGS                                    */
/* -------------------------------------------------- */

export async function updateSettings(
  data,
) {
  const settings =
    await getOrCreateSettings()

  if (data.cv !== undefined) {
    await validateCvAsset(
      data.cv,
    )
  }

  if (
    data.profileImage !== undefined
  ) {
    await validateProfileImage(
      data.profileImage,
    )
  }

  if (data.socialLinks) {
    settings.socialLinks = {
      ...settings.socialLinks?.toObject?.(),
      ...data.socialLinks,
    }
  }

  if (data.seo) {
    settings.seo = {
      ...settings.seo?.toObject?.(),
      ...data.seo,
    }
  }

  const directFields = [
    'siteName',
    'headline',
    'shortBio',
    'email',
    'location',
    'cv',
    'profileImage',
  ]

  for (const field of directFields) {
    if (data[field] !== undefined) {
      settings[field] =
        data[field]
    }
  }

  await settings.save()

  await settings.populate([
    {
      path: 'cv',
    },
    {
      path: 'profileImage',
    },
  ])

  return settings
}