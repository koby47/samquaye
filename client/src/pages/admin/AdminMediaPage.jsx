import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  deleteMediaAsset,
  getMediaAssets,
  uploadFileToR2,
} from '../../services/mediaService.js'

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) {
    return '—'
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 ** 2) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`
  }

  return `${(
    bytes / 1024 ** 2
  ).toFixed(1)} MB`
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(date)
}

function getImageMetadata(file) {
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

      const image =
        new Image()

      const objectUrl =
        URL.createObjectURL(
          file,
        )

      image.onload = () => {
        const metadata = {
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

        resolve(metadata)
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

function AdminMediaPage() {
  const [
    assets,
    setAssets,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    filter,
    setFilter,
  ] = useState('all')

  const [
    uploading,
    setUploading,
  ] = useState(false)

  const [
    uploadStatus,
    setUploadStatus,
  ] = useState('')

  const [
    deletingId,
    setDeletingId,
  ] = useState(null)

  const [
    selectedAsset,
    setSelectedAsset,
  ] = useState(null)

  const loadAssets =
    useCallback(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getMediaAssets()

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
            'Unable to load media assets.',
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  const filteredAssets =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return assets.filter(
        (asset) => {
          if (
            filter !== 'all' &&
            asset.mediaType !==
              filter
          ) {
            return false
          }

          if (!query) {
            return true
          }

          const searchable =
            [
              asset.filename,
              asset.originalFilename,
              asset.altText,
              asset.mimeType,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase()

          return searchable.includes(
            query,
          )
        },
      )
    }, [
      assets,
      search,
      filter,
    ])

  const statistics =
    useMemo(
      () => ({
        total: assets.length,

        images:
          assets.filter(
            (asset) =>
              asset.mediaType ===
              'image',
          ).length,

        documents:
          assets.filter(
            (asset) =>
              asset.mediaType ===
              'document',
          ).length,
      }),
      [assets],
    )

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
      setSuccess('')

      const uploadedAssets = []

      for (
        let index = 0;
        index < files.length;
        index += 1
      ) {
        const file =
          files[index]

        setUploadStatus(
          `Uploading ${
            index + 1
          } of ${
            files.length
          }: ${file.name}`,
        )

        const metadata =
          await getImageMetadata(
            file,
          )

        const response =
          await uploadFileToR2({
            file,

            altText:
              file.type.startsWith(
                'image/',
              )
                ? file.name
                    .replace(
                      /\.[^.]+$/,
                      '',
                    )
                    .replace(
                      /[-_]+/g,
                      ' ',
                    )
                : '',

            width:
              metadata.width,

            height:
              metadata.height,
          })

        if (response?.asset) {
          uploadedAssets.push(
            response.asset,
          )
        }
      }

      if (
        uploadedAssets.length >
        0
      ) {
        setAssets(
          (current) => [
            ...uploadedAssets.reverse(),
            ...current,
          ],
        )

        setSuccess(
          `${
            uploadedAssets.length
          } ${
            uploadedAssets.length ===
            1
              ? 'file'
              : 'files'
          } uploaded successfully.`,
        )
      }
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to upload media.',
      )
    } finally {
      setUploading(false)
      setUploadStatus('')
    }
  }

  async function handleDelete(
    asset,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${asset.originalFilename}"?\n\nThis permanently removes the file from Cloudflare R2 and the media library. Media currently used by a project or portfolio setting cannot be deleted.`,
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(
        asset._id,
      )

      setError('')
      setSuccess('')

      await deleteMediaAsset(
        asset._id,
      )

      setAssets(
        (current) =>
          current.filter(
            (item) =>
              item._id !==
              asset._id,
          ),
      )

      if (
        selectedAsset?._id ===
        asset._id
      ) {
        setSelectedAsset(null)
      }

      setSuccess(
        'Media asset deleted successfully.',
      )
    } catch (requestError) {
      /*
       * The backend deliberately returns
       * 409 when the media asset is still
       * referenced by a project or
       * portfolio setting.
       */
      if (
        requestError?.status ===
        409
      ) {
        setError(
          'This media asset is currently in use and cannot be deleted. Remove it from the project or portfolio settings first.',
        )
      } else {
        setError(
          requestError?.message ||
            'Unable to delete media asset.',
        )
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >
        <div>
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-[0.2em]
              text-cyan-600
              dark:text-cyan-400
            "
          >
            Media
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
            "
          >
            Media Manager
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-600
              dark:text-slate-400
            "
          >
            Manage images and
            documents stored in your
            Cloudflare R2 media
            library.
          </p>
        </div>

        <label
          className="
            inline-flex
            min-h-11
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            bg-cyan-600
            px-5
            text-sm
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
            : 'Upload media'}

          <input
            type="file"
            multiple
            accept="
              image/jpeg,
              image/png,
              image/webp,
              application/pdf
            "
            disabled={uploading}
            onChange={
              handleUpload
            }
            className="sr-only"
          />
        </label>
      </div>

      {/* Messages */}
      {uploadStatus && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-cyan-200
            bg-cyan-50
            p-4
            text-sm
            text-cyan-700
            dark:border-cyan-900
            dark:bg-cyan-950/30
            dark:text-cyan-300
          "
        >
          {uploadStatus}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="
            mt-6
            rounded-xl
            border
            border-emerald-200
            bg-emerald-50
            p-4
            text-sm
            text-emerald-700
            dark:border-emerald-900
            dark:bg-emerald-950/30
            dark:text-emerald-300
          "
        >
          {success}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="
            mt-6
            flex
            flex-col
            gap-3
            rounded-xl
            border
            border-red-200
            bg-red-50
            p-4
            text-sm
            text-red-700
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-red-900
            dark:bg-red-950/30
            dark:text-red-300
          "
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={loadAssets}
            className="
              shrink-0
              font-semibold
            "
          >
            Reload
          </button>
        </div>
      )}

      {/* Statistics */}
      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-3
        "
      >
        <StatCard
          label="Total media"
          value={statistics.total}
        />

        <StatCard
          label="Images"
          value={statistics.images}
        />

        <StatCard
          label="Documents"
          value={
            statistics.documents
          }
        />
      </div>

      {/* Search/filter */}
      <div
        className="
          mt-6
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            md:flex-row
          "
        >
          <div className="flex-1">
            <label
              htmlFor="media-search"
              className="sr-only"
            >
              Search media
            </label>

            <input
              id="media-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search filename, alt text or MIME type..."
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4 py-3
                text-sm
                text-slate-950
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            />
          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(
                event.target.value,
              )
            }
            aria-label="Filter media"
            className="
              rounded-xl
              border
              border-slate-300
              bg-white
              px-4 py-3
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
          >
            <option value="all">
              All media
            </option>

            <option value="image">
              Images
            </option>

            <option value="document">
              Documents
            </option>
          </select>
        </div>
      </div>

      {/* Media grid */}
      {loading ? (
        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="
                h-72
                animate-pulse
                rounded-2xl
                bg-slate-200
                dark:bg-slate-900
              "
            />
          ))}
        </div>
      ) : filteredAssets.length ===
        0 ? (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            px-6 py-16
            text-center
            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <h2
            className="
              text-lg
              font-semibold
            "
          >
            No media found
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {search ||
            filter !== 'all'
              ? 'Try changing your search or filter.'
              : 'Upload your first image or document.'}
          </p>
        </div>
      ) : (
        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {filteredAssets.map(
            (asset) => (
              <MediaCard
                key={asset._id}
                asset={asset}
                deleting={
                  deletingId ===
                  asset._id
                }
                onView={() =>
                  setSelectedAsset(
                    asset,
                  )
                }
                onDelete={() =>
                  handleDelete(
                    asset,
                  )
                }
              />
            ),
          )}
        </div>
      )}

      {/* Details modal */}
      {selectedAsset && (
        <MediaDetailsModal
          asset={selectedAsset}
          deleting={
            deletingId ===
            selectedAsset._id
          }
          onClose={() =>
            setSelectedAsset(
              null,
            )
          }
          onDelete={() =>
            handleDelete(
              selectedAsset,
            )
          }
        />
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <p
        className="
          text-sm
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-3xl
          font-bold
          tracking-tight
        "
      >
        {value}
      </p>
    </div>
  )
}

function MediaCard({
  asset,
  deleting,
  onView,
  onDelete,
}) {
  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <button
        type="button"
        onClick={onView}
        className="
          block
          w-full
          text-left
        "
      >
        <div
          className="
            flex
            aspect-video
            items-center
            justify-center
            overflow-hidden
            bg-slate-100
            dark:bg-slate-950
          "
        >
          {asset.mediaType ===
            'image' &&
          asset.publicUrl ? (
            <img
              src={
                asset.publicUrl
              }
              alt={
                asset.altText ||
                asset.originalFilename
              }
              loading="lazy"
              className="
                h-full
                w-full
                object-cover
                transition
                duration-300
                hover:scale-[1.02]
              "
            />
          ) : (
            <div className="text-center">
              <div
                className="
                  text-4xl
                  font-bold
                  text-slate-300
                  dark:text-slate-700
                "
              >
                PDF
              </div>

              <p
                className="
                  mt-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Document
              </p>
            </div>
          )}
        </div>
      </button>

      <div className="p-4">
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-semibold
              "
              title={
                asset.originalFilename
              }
            >
              {
                asset.originalFilename
              }
            </p>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              {formatFileSize(
                asset.size,
              )}
            </p>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              bg-slate-100
              px-2.5 py-1
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-600
              dark:bg-slate-800
              dark:text-slate-300
            "
          >
            {asset.mediaType}
          </span>
        </div>

        <div
          className="
            mt-4
            flex
            gap-2
          "
        >
          <button
            type="button"
            onClick={onView}
            className="
              flex-1
              rounded-lg
              border
              border-slate-300
              px-3 py-2
              text-xs
              font-semibold
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            Details
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="
              rounded-lg
              border
              border-red-200
              px-3 py-2
              text-xs
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-red-900
              dark:text-red-400
              dark:hover:bg-red-950/30
            "
          >
            {deleting
              ? 'Deleting...'
              : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}

function MediaDetailsModal({
  asset,
  deleting,
  onClose,
  onDelete,
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-950/70
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Media details"
        className="
          max-h-[90vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-slate-200
            p-5
            dark:border-slate-800
          "
        >
          <div className="min-w-0">
            <h2
              className="
                truncate
                text-lg
                font-semibold
              "
            >
              {
                asset.originalFilename
              }
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Media details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex
              h-9 w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-300
              text-xl
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:hover:bg-slate-800
            "
          >
            ×
          </button>
        </div>

        {asset.mediaType ===
          'image' &&
        asset.publicUrl && (
          <div
            className="
              bg-slate-100
              p-4
              dark:bg-slate-950
            "
          >
            <img
              src={
                asset.publicUrl
              }
              alt={
                asset.altText ||
                asset.originalFilename
              }
              className="
                mx-auto
                max-h-112
                max-w-full
                rounded-xl
                object-contain
              "
            />
          </div>
        )}

        <div className="p-5">
          <dl
            className="
              grid
              gap-5
              sm:grid-cols-2
            "
          >
            <Detail
              label="Original filename"
              value={
                asset.originalFilename
              }
            />

            <Detail
              label="Stored filename"
              value={
                asset.filename
              }
            />

            <Detail
              label="Media type"
              value={
                asset.mediaType
              }
            />

            <Detail
              label="MIME type"
              value={
                asset.mimeType
              }
            />

            <Detail
              label="File size"
              value={formatFileSize(
                asset.size,
              )}
            />

            <Detail
              label="Dimensions"
              value={
                asset.width &&
                asset.height
                  ? `${asset.width} × ${asset.height} px`
                  : '—'
              }
            />

            <Detail
              label="Storage"
              value={
                asset.storageProvider ||
                '—'
              }
            />

            <Detail
              label="Uploaded"
              value={formatDate(
                asset.createdAt,
              )}
            />

            <div className="sm:col-span-2">
              <Detail
                label="Alt text"
                value={
                  asset.altText ||
                  '—'
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Detail
                label="Object key"
                value={
                  asset.objectKey ||
                  '—'
                }
              />
            </div>
          </dl>

          <div
            className="
              mt-6
              flex
              flex-col
              gap-3
              border-t
              border-slate-200
              pt-5
              sm:flex-row
              sm:justify-end
              dark:border-slate-800
            "
          >
            {asset.publicUrl && (
              <a
                href={
                  asset.publicUrl
                }
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  min-h-10
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-300
                  px-4
                  text-sm
                  font-semibold
                  transition
                  hover:bg-slate-50
                  dark:border-slate-700
                  dark:hover:bg-slate-800
                "
              >
                Open file ↗
              </a>
            )}

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                rounded-lg
                bg-red-600
                px-4
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-red-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {deleting
                ? 'Deleting...'
                : 'Delete media'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
}) {
  return (
    <div>
      <dt
        className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </dt>

      <dd
        className="
          mt-1
          wrap-break-word
          text-sm
          text-slate-800
          dark:text-slate-200
        "
      >
        {value}
      </dd>
    </div>
  )
}

export default AdminMediaPage