import { IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonNote, IonPage, IonRouterLink, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import { useContext } from "react";
import { ScannedDataContext } from "../contexts/ScannedDataContext";

import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ScannedData } from "../contexts/ScannedDataContext.types";

const currentDate = new Date()

const parseUrl = (value: string): URL | null => {
  let url;
  
  try {
    url = new URL(value);
  } catch (_) {
    return null;  
  }

  if (url.protocol === "http:" || url.protocol === "https:")
    return url;

  return null
}

export default function History() {
  const scannedDataContext = useContext(ScannedDataContext)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historique</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={() => scannedDataContext?.clear()}>
              <IonIcon icon={trashOutline} slot="end" />
              Effacer
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {
          scannedDataContext?.history
            ? <IonList>
              {
                scannedDataContext.history.length === 0 
                ? (
                    <IonItem>
                      <IonLabel>Vous n'avez pas encore scanné de code !</IonLabel>
                    </IonItem>
                  )
                : (
                    <IonList>
                      {
                        scannedDataContext.history.map((data, idx) => 
                          <IonItem key={idx}>
                            <ScannedElement {...data} />
                          </IonItem>
                        )
                      }
                    </IonList>
                  )
              }
              </IonList>
            : <IonLoading isOpen message="Chargement de l'historique..." />
        }
      </IonContent>
    </IonPage>
  )
}

function ScannedElement(data: ScannedData) {
  const scannedDataContext = useContext(ScannedDataContext)

  const url = parseUrl(data.value)

  return (
    <>
      <IonGrid>
        <IonRow>
          {
            url !== null 
              ? <IonRouterLink href={url.toString()}>{url.hostname}</IonRouterLink>
              : <IonLabel>{data.value}</IonLabel>
          }
        </IonRow>
        <IonRow>
          <IonNote>
            {
              formatRelative(data.date, currentDate, {
                locale: fr,
              })
            }
          </IonNote>
        </IonRow>
      </IonGrid>
      <IonButton slot="end" fill="clear" onClick={() => scannedDataContext?.remove(data)}>
        <IonIcon icon={trashOutline} slot="icon-only" />
      </IonButton>
    </>
  )
}
