import ContactEnquiry from '../models/ContactEnquiry.js'

function createServiceError(
  message,
  status,
) {
  const error = new Error(message)
  error.status = status

  return error
}

/* -------------------------------------------------- */
/* CREATE ENQUIRY                                     */
/* -------------------------------------------------- */

export async function createContactEnquiry(
  data,
) {
  return ContactEnquiry.create({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  })
}

/* -------------------------------------------------- */
/* LIST ENQUIRIES                                     */
/* -------------------------------------------------- */

export async function getContactEnquiries({
  status,
} = {}) {
  const query = {}

  if (status) {
    query.status = status
  }

  return ContactEnquiry.find(query)
    .sort({
      createdAt: -1,
    })
    .lean()
}

/* -------------------------------------------------- */
/* GET ENQUIRY                                        */
/* -------------------------------------------------- */

export async function getContactEnquiryById(
  enquiryId,
) {
  const enquiry =
    await ContactEnquiry.findById(
      enquiryId,
    )

  if (!enquiry) {
    throw createServiceError(
      'Contact enquiry not found.',
      404,
    )
  }

  return enquiry
}

/* -------------------------------------------------- */
/* UPDATE STATUS                                      */
/* -------------------------------------------------- */

export async function updateContactEnquiryStatus(
  enquiryId,
  status,
) {
  const enquiry =
    await ContactEnquiry.findById(
      enquiryId,
    )

  if (!enquiry) {
    throw createServiceError(
      'Contact enquiry not found.',
      404,
    )
  }

  enquiry.status = status

  if (
    status === 'read' &&
    !enquiry.readAt
  ) {
    enquiry.readAt = new Date()
  }

  if (
    status === 'replied' &&
    !enquiry.repliedAt
  ) {
    enquiry.repliedAt = new Date()

    if (!enquiry.readAt) {
      enquiry.readAt = new Date()
    }
  }

  if (
    status === 'archived' &&
    !enquiry.archivedAt
  ) {
    enquiry.archivedAt = new Date()
  }

  await enquiry.save()

  return enquiry
}

/* -------------------------------------------------- */
/* DELETE ENQUIRY                                     */
/* -------------------------------------------------- */

export async function deleteContactEnquiry(
  enquiryId,
) {
  const enquiry =
    await ContactEnquiry.findById(
      enquiryId,
    )

  if (!enquiry) {
    throw createServiceError(
      'Contact enquiry not found.',
      404,
    )
  }

  await enquiry.deleteOne()

  return enquiry
}