import { IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { useHistory } from "react-router";
import Scanner from "../components/Scanner";
import { ScannedDataContext } from "../contexts/ScannedDataContext";

export default function Scan() {
  const history = useHistory()
  const scanDataContext = useContext(ScannedDataContext)

  const onScanEnd = (value: string | null) => {
    if (value !== null) {
      scanDataContext?.add({
        value: value,
        date: new Date(),
      })
    }

    history.push('history')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scanneur</IonTitle>
        </IonToolbar>
      </IonHeader>
        <Scanner onScanEnd={onScanEnd} />
    </IonPage>
  )
}

