
export type ScannedDataContextType = {
  history: ScannedData[]
  add: (data: ScannedData) => void
  remove: (data: ScannedData) => void
  clear: () => void
}

export type ScannedData = {
  date: Date
  value: string
}

