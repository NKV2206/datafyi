export type Dataset = {
  id: string
  blobId: string
  name: string
  sizeMB: number
  owner: string
  tags: string[]
  description: string
}

export type PurchaseRecord = {
  at: string
  query: string
  blobIds: string[]
  totalMB: number
  totalPrice: number
  files: { id: string; name: string }[]
}
