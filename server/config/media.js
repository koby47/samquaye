export const MEDIA_LIMITS = Object.freeze({
  image: {
    maxBytes: 5 * 1024 * 1024,

    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
  },

  document: {
    maxBytes: 10 * 1024 * 1024,

    allowedMimeTypes: [
      'application/pdf',
    ],
  },
})

export const MEDIA_FOLDERS =
  Object.freeze({
    image: 'images',
    document: 'documents',
  })