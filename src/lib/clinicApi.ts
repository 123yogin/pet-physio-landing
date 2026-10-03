/**
 * Shared booking helpers — the clinic API base URL and the local-date formatter
 * were copy-pasted across every booking subform (BookingForm,
 * FacilitySlotBooking, IndoorFacilityBooking, ServiceRequestBooking) and the
 * usePublicServiceCodes hook. Defined once here so they can't drift.
 */

/** Base path for the clinic API. Overridable at build time; same-origin by default. */
export const CLINIC_API = (import.meta as any).env?.VITE_CLINIC_API_URL ?? '/api/v1';

/** Local calendar date `offsetDays` from today, as `YYYY-MM-DD` (local, not UTC). */
export function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}
