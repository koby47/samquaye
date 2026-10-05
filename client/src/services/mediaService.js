import {
  apiRequest,
  ApiError,
} from './api.js'

export function getMediaAssets({
  mediaType,
} = {}) {
  const params =
    new URLSearchParams()

  if (mediaType) {
    params.set(
      'mediaType',
      mediaType,
    )
  }

  const query =
    params.toString()

  return apiRequest(
    `/admin/media${
      query ? `?${query}` : ''
    }`,
  )
}

export function getMediaAsset(
  assetId,
) {
  return apiRequest(
    `/admin/media/${encodeURIComponent(
      assetId,
    )}`,
  )
}

export function requestMediaUpload(
  data,
) {
  return apiRequest(
    '/admin/media/upload-url',
    {
      method: 'POST',
      body: data,
    },
  )
}

export function confirmMediaUpload(
  data,
) {
  return apiRequest(
    '/admin/media/confirm',
    {
      method: 'POST',
      body: data,
    },
  )
}

export function deleteMediaAsset(
  assetId,
) {
  return apiRequest(
    `/admin/media/${encodeURIComponent(
      assetId,
    )}`,
    {
      method: 'DELETE',
    },
  )
}

export async function uploadFileToR2({
  file,
  altText = '',
  width = null,
  height = null,
}) {
  const mediaType =
    file.type.startsWith('image/')
      ? 'image'
      : file.type ===
          'application/pdf'
        ? 'document'
        : null

  if (!mediaType) {
    throw new ApiError(
      'Unsupported file type.',
      400,
    )
  }

  const response =
    await requestMediaUpload({
      filename: file.name,
      mediaType,
      mimeType: file.type,
      size: file.size,
    })

  const upload =
    response?.upload

  if (
    !upload?.uploadUrl ||
    !upload?.uploadToken
  ) {
    throw new ApiError(
      'The server did not return a valid upload URL.',
      500,
    )
  }

  let uploadResponse

  try {
    uploadResponse =
      await fetch(
        upload.uploadUrl,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              file.type,
          },

          body: file,
        },
      )
  } catch {
    throw new ApiError(
      'Unable to upload the file to media storage.',
      0,
    )
  }

  if (!uploadResponse.ok) {
    throw new ApiError(
      `Media storage upload failed with status ${uploadResponse.status}.`,
      uploadResponse.status,
    )
  }

  return confirmMediaUpload({
    uploadToken:
      upload.uploadToken,

    altText:
      altText.trim(),

    width:
      width || null,

    height:
      height || null,
  })
}