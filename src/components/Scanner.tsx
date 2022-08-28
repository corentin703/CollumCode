import { IonFab, IonFabButton, IonIcon, useIonViewDidEnter, useIonViewDidLeave } from "@ionic/react";
import { stopOutline } from "ionicons/icons";
import { useCallback, useEffect } from "react";
import useCodeScanner from "../hooks/useCodeScanner";
import './Scanner.css'
import { ScannerProps } from "./Scanner.type";

export default function Scanner({ onScanEnd }: ScannerProps) {
  const { startScan, stopScan, checkPermissions } = useCodeScanner()

  const startScanner = useCallback(() => {
    checkPermissions()
      .then(allowed => {
        if (!allowed)
          return

        startScan()
          .then(value => {
            if (onScanEnd !== undefined)
              onScanEnd(value)
          })
      })
  }, [startScan, checkPermissions, onScanEnd])

  const stopScanner = useCallback(() => {
    stopScan()
      .then(_ => {
        if (onScanEnd !== undefined)
          onScanEnd(null)
      })
  }, [stopScan, onScanEnd])

  useEffect(() => {
    const registerBackButton = (ev: any) => {
      ev.detail.register(10, () => {
        stopScanner()
      });
    }

    document.addEventListener('ionBackButton', registerBackButton);

    return () => {
      document.removeEventListener('ionBackButton', registerBackButton);
    }
  }, [startScanner, stopScanner])

  useIonViewDidEnter(() => {
    startScanner()
  })

  useIonViewDidLeave(() => {
    stopScanner()
  })

  return (
    <>
      <div className="scan_area_wrapper">
        <div className="scan_area">
        
        </div>
      </div>
    
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton>
          <IonIcon icon={stopOutline} onClick={stopScanner} />
        </IonFabButton>
      </IonFab>
    </>
  )
}
