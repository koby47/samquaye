import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getMediaAssets,
  uploadFileToR2,
} from '../../services/mediaService.js'

function deriveAltText(
  filename,
) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getImageDimensions(
  file,
) {
  return new Promise(
    (resolve) => {
      if (
        !file.type.startsWith(
          'image/',
        )
      ) {
        resolve({
          width: null,
          height: null,
        })

        return
      }

      const objectUrl =
        URL.createObjectURL(file)

      const image =
        new Image()

      image.onload = () => {
        const dimensions = {
          width:
            image.naturalWidth ||
            null,

          height:
            image.naturalHeight ||
            null,
        }

        URL.revokeObjectURL(
          objectUrl,
        )

        resolve(dimensions)
      }

      image.onerror = () => {
        URL.revokeObjectURL(
          objectUrl,
        )

        resolve({
          width: null,
          height: null,
        })
      }

      image.src = objectUrl
    },
  )
}

function getAssetId(asset) {
  if (!asset) {
    return null
  }

  if (
    typeof asset === 'string'
  ) {
    return asset
  }

  return asset._id || null
}

function MediaPicker({
  value,
  onChange,
  multiple = false,
  mediaType = 'image',
  label = 'Media',
  helpText = '',
}) {
  const [
    assets,
    setAssets,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    uploading,
    setUploading,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    search,
    setSearch,
  ] = useState('')

  const loadAssets =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getMediaAssets({
            mediaType,
          })

        setAssets(
          Array.isArray(
            response?.assets,
          )
            ? response.assets
            : [],
        )
      } catch (requestError) {
        setError(
          requestError?.message ||
            'Unable to load media.',
        )
      } finally {
        setLoading(false)
      }
    }, [mediaType])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  const selectedIds =
    useMemo(() => {
      if (multiple) {
        return new Set(
          (
            Array.isArray(value)
              ? value
              : []
          )
            .map(getAssetId)
            .filter(Boolean),
        )
      }

      const id =
        getAssetId(value)

      return new Set(
        id ? [id] : [],
      )
    }, [value, multiple])

  const filteredAssets =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      if (!query) {
        return assets
      }

      return assets.filter(
        (asset) =>
          [
            asset.filename,
            asset.originalFilename,
            asset.altText,
            asset.mimeType,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query),
      )
    }, [assets, search])

  function handleSelect(
    asset,
  ) {
    if (!multiple) {
      onChange(asset)
      return
    }

    const current =
      Array.isArray(value)
        ? value
        : []

    const exists =
      current.some(
        (item) =>
          getAssetId(item) ===
          asset._id,
      )

    if (exists) {
      onChange(
        current.filter(
          (item) =>
            getAssetId(item) !==
            asset._id,
        ),
      )

      return
    }

    onChange([
      ...current,
      asset,
    ])
  }

  async function handleUpload(
    event,
  ) {
    const files =
      Array.from(
        event.target.files ||
          [],
      )

    event.target.value = ''

    if (!files.length) {
      return
    }

    try {
      setUploading(true)
      setError('')

      const uploadedAssets = []

      for (const file of files) {
        const dimensions =
          await getImageDimensions(
            file,
          )

        const response =
          await uploadFileToR2({
            file,

            altText:
              mediaType === 'image'
                ? deriveAltText(
                    file.name,
                  )
                : '',

            width:
              dimensions.width,

            height:
              dimensions.height,
          })

        if (response?.asset) {
          uploadedAssets.push(
            response.asset,
          )
        }
      }

      if (
        uploadedAssets.length
      ) {
        setAssets(
          (current) => [
            ...[
              ...uploadedAssets,
            ].reverse(),
            ...current,
          ],
        )

        if (multiple) {
          const current =
            Array.isArray(value)
              ? value
              : []

          onChange([
            ...current,
            ...uploadedAssets,
          ])
        } else {
          onChange(
            uploadedAssets[
              uploadedAssets.length -
                1
            ],
          )
        }
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to upload media.',
      )
    } finally {
      setUploading(false)
    }
  }

  const accept =
    mediaType === 'document'
      ? 'application/pdf'
      : 'image/jpeg,image/png,image/webp'

  return (
    <div>
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h3
            className="
              text-sm
              font-semibold
              text-slate-800
              dark:text-slate-200
            "
          >
            {label}
          </h3>

          {helpText && (
            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              {helpText}
            </p>
          )}
        </div>

        <label
          className="
            inline-flex
            min-h-10
            cursor-pointer
            items-center
            justify-center
            rounded-lg
            bg-cyan-600
            px-4
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-cyan-700
            dark:bg-cyan-400
            dark:text-slate-950
            dark:hover:bg-cyan-300
          "
        >
          {uploading
            ? 'Uploading...'
            : mediaType ===
                'document'
              ? 'Upload PDF'
              : 'Upload image'}

          <input
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={uploading}
            onChange={
              handleUpload
            }
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-3
            text-xs
            text-red-700
            dark:border-red-900
            dark:bg-red-950/30
            dark:text-red-300
          "
        >
          {error}
        </div>
      )}

      <input
        type="search"
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value,
          )
        }
        placeholder={
          mediaType === 'document'
            ? 'Search PDF files...'
            : 'Search images...'
        }
        className="
          mt-4
          w-full
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4 py-2.5
          text-sm
          text-slate-950
          outline-none
          focus:border-cyan-500
          focus:ring-2
          focus:ring-cyan-500/20
          dark:border-slate-700
          dark:bg-slate-950
          dark:text-white
        "
      />

      {loading ? (
        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
          "
        >
          {Array.from({
            length: 3,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  aspect-square
                  animate-pulse
                  rounded-xl
                  bg-slate-100
                  dark:bg-slate-800
                "
              />
            ),
          )}
        </div>
      ) : filteredAssets
          .length === 0 ? (
        <div
          className="
            mt-4
            rounded-xl
            border
            border-dashed
            border-slate-300
            px-5 py-10
            text-center
            text-sm
            text-slate-500
            dark:border-slate-700
            dark:text-slate-400
          "
        >
          {mediaType ===
          'document'
            ? 'No PDF documents found.'
            : 'No images found.'}
        </div>
      ) : (
        <div
          className="
            mt-4
            grid
            max-h-96
            grid-cols-2
            gap-3
            overflow-y-auto
            pr-1
            sm:grid-cols-3
          "
        >
          {filteredAssets.map(
            (asset) => {
              const selected =
                selectedIds.has(
                  asset._id,
                )

              return (
                <button
                  key={
                    asset._id
                  }
                  type="button"
                  onClick={() =>
                    handleSelect(
                      asset,
                    )
                  }
                  className={`
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    text-left
                    transition
                    ${
                      selected
                        ? `
                          border-cyan-500
                          ring-2
                          ring-cyan-500/20
                        `
                        : `
                          border-slate-200
                          hover:border-slate-400
                          dark:border-slate-800
                          dark:hover:border-slate-600
                        `
                    }
                  `}
                >
                  {mediaType ===
                  'image' ? (
                    <div
                      className="
                        aspect-square
                        bg-slate-100
                        dark:bg-slate-950
                      "
                    >
                      <img
                        src={
                          asset.publicUrl
                        }
                        alt={
                          asset.altText ||
                          asset.originalFilename ||
                          ''
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    </div>
                  ) : (
                    <div
                      className="
                        flex
                        aspect-square
                        items-center
                        justify-center
                        bg-slate-100
                        p-4
                        dark:bg-slate-950
                      "
                    >
                      <div
                        className="
                          text-center
                        "
                      >
                        <div
                          className="
                            text-3xl
                            font-black
                            text-red-500
                          "
                        >
                          PDF
                        </div>

                        <p
                          className="
                            mt-2
                            line-clamp-2
                            text-xs
                            text-slate-600
                            dark:text-slate-400
                          "
                        >
                          {
                            asset.originalFilename
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-2.5">
                    <p
                      className="
                        truncate
                        text-xs
                        font-semibold
                      "
                    >
                      {asset.originalFilename ||
                        asset.filename}
                    </p>
                  </div>

                  {selected && (
                    <span
                      className="
                        absolute
                        right-2 top-2
                        flex
                        h-6 w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-cyan-600
                        text-xs
                        font-bold
                        text-white
                      "
                    >
                      ✓
                    </span>
                  )}
                </button>
              )
            },
          )}
        </div>
      )}
    </div>
  )
}

export default MediaPicker