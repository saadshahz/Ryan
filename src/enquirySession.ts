/*
 * Session-level state for the automatic enquiry popup.
 *
 * Once a visitor has seen the popup, interacted with an enquiry form or sent an enquiry,
 * the popup is not shown automatically again for the rest of the browser session.
 */
const STORAGE_KEY = "rg-enquiry-engaged";

// Fallback for browsers where sessionStorage is unavailable (e.g. blocked storage).
let engagedInMemory = false;

export function hasEnquiryEngaged() {
  if (engagedInMemory) return true;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markEnquiryEngaged() {
  engagedInMemory = true;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage unavailable: the in-memory flag still covers the current page.
  }
}
