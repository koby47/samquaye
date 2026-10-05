import {
  getDashboardSummary,
} from '../services/dashboardService.js'

/* -------------------------------------------------- */
/* ADMIN: DASHBOARD SUMMARY                           */
/* -------------------------------------------------- */

export async function getAdminDashboard(
  req,
  res,
  next,
) {
  try {
    const dashboard =
      await getDashboardSummary()

    return res.status(200).json({
      success: true,
      dashboard,
    })
  } catch (error) {
    next(error)
  }
}