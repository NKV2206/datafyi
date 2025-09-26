// Simple localStorage helpers (demo only)

import type { Dataset, PurchaseRecord } from "./types"

const UPLOADS_KEY = "datafyi.uploads"
const PURCHASES_KEY = "datafyi.purchases"

export function getMyUploads(): Dataset[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(UPLOADS_KEY) || "[]")
  } catch {
    return []
  }
}

export function saveMyUpload(ds: Dataset) {
  const curr = getMyUploads()
  localStorage.setItem(UPLOADS_KEY, JSON.stringify([ds, ...curr]))
}

export function getMyPurchases(): PurchaseRecord[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(PURCHASES_KEY) || "[]")
  } catch {
    return []
  }
}

export function savePurchase(p: PurchaseRecord) {
  const curr = getMyPurchases()
  localStorage.setItem(PURCHASES_KEY, JSON.stringify([p, ...curr]))
}
