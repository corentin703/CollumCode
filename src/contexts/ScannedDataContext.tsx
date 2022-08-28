import { IonLoading, ReactComponentOrElement } from "@ionic/react";
import { createContext, useCallback, useEffect, useState } from "react";
import { ScannedData, ScannedDataContextType } from "./ScannedDataContext.types";
import { Preferences } from '@capacitor/preferences';

export const ScannedDataContext = createContext<ScannedDataContextType | undefined>(undefined)

const HistoryStorageKey = 'history'

const getHistoryFromPreferences = async (): Promise<ScannedData[]> => {
  const storedData = await Preferences.get({ key: HistoryStorageKey })

  if (storedData.value === null) {
    return [];
  }

  console.log(storedData.value)

  const history = JSON.parse(storedData.value)
    .map((item: any) => ({
      ...item,
      date: new Date(item.date),
    }))
    
  return history
}

const storeHistoryInPreferences = async (history: ScannedData[]): Promise<void> => {
  const stringifiedHistory = JSON.stringify(history)
  await Preferences.set({ key: HistoryStorageKey, value: stringifiedHistory })
}

export default function ScannedDataContextProvider({ children }: { children: ReactComponentOrElement }) {
  const [scannedData, setScannedData] = useState<ScannedData[] | undefined>(undefined)

  const addScan = useCallback((data: ScannedData) => {
    if (scannedData === undefined)
      return
    
    setScannedData([
      data,
      ...scannedData,
    ])
  }, [scannedData])

  const removeScan = useCallback((data: ScannedData) => {
    if (scannedData === undefined)
      return
    
    setScannedData([
      ...scannedData.filter(it => 
        it.date !== data.date && it.value !== data.value
      )
    ])
  }, [scannedData])

  const clearScans = useCallback(() => {
    if (scannedData === undefined)
      return

    setScannedData([])
  }, [scannedData])

  useEffect(() => {
    getHistoryFromPreferences()
      .then(history => setScannedData(history))
  }, [])

  useEffect(() => {
    if (scannedData === undefined)
      return

    storeHistoryInPreferences(scannedData)
      .then(_ => console.log('Data saved'))
  }, [scannedData])

  if (scannedData === undefined) {
    return <IonLoading isOpen message="Chargement de l'historique..." />
  }

  return (
    <ScannedDataContext.Provider
      value={{
        history: scannedData,
        add: addScan,
        remove: removeScan,
        clear: clearScans,
      }}
    >
      {children}
    </ScannedDataContext.Provider>
  )
}
