import { apiRequest } from './api.js'

/*
 * Public contact form submission.
 */
export function submitContactEnquiry(
  data,
) {
  return apiRequest('/contact', {
    method: 'POST',
    body: data,
  })
}

/*
 * Admin: list enquiries.
 *
 * Optional status:
 * new | read | replied | archived
 */
export function getAdminEnquiries({
  status,
} = {}) {
  const params =
    new URLSearchParams()

  if (status) {
    params.set(
      'status',
      status,
    )
  }

  const query =
    params.toString()

  return apiRequest(
    `/admin/contact${
      query
        ? `?${query}`
        : ''
    }`,
  )
}

/*
 * Admin: retrieve one enquiry.
 */
export function getAdminEnquiry(
  enquiryId,
) {
  return apiRequest(
    `/admin/contact/${encodeURIComponent(
      enquiryId,
    )}`,
  )
}

/*
 * Admin: update enquiry status.
 */
export function updateAdminEnquiryStatus(
  enquiryId,
  status,
) {
  return apiRequest(
    `/admin/contact/${encodeURIComponent(
      enquiryId,
    )}`,
    {
      method: 'PATCH',
      body: {
        status,
      },
    },
  )
}

/*
 * Admin: permanently delete enquiry.
 */
export function deleteAdminEnquiry(
  enquiryId,
) {
  return apiRequest(
    `/admin/contact/${encodeURIComponent(
      enquiryId,
    )}`,
    {
      method: 'DELETE',
    },
  )
}