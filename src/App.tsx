import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { StatusBar, Style } from '@capacitor/status-bar';

import { scanOutline, timeOutline } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Scan from './pages/Scan';
import History from './pages/History';
import ScannedDataContextProvider from './contexts/ScannedDataContext';

setupIonicReact();

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

if (prefersDark.matches) {
  StatusBar.setBackgroundColor({
    color: '#1f1f1f',
  })

  StatusBar.setStyle({
    style: Style.Dark,
  })
} else {
  StatusBar.setBackgroundColor({
    color: '#f4f5f8',
  })

  StatusBar.setStyle({
    style: Style.Light,
  })
}

const App: React.FC = () => (
  <IonApp>
    <ScannedDataContextProvider>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/history">
              <History />
            </Route>
            <Route exact path="/scan">
              <Scan />
            </Route>
            <Route exact path="/">
              <Redirect to="/scan" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="scan" href="/scan">
              <IonIcon icon={scanOutline} />
              <IonLabel>Scanneur</IonLabel>
            </IonTabButton>
            <IonTabButton tab="history" href="/history">
              <IonIcon icon={timeOutline} />
              <IonLabel>Historique</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </ScannedDataContextProvider>
  </IonApp>
);

export default App;
