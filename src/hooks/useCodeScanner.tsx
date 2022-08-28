import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useIonAlert } from '@ionic/react';

export default function useCodeScanner() {
  const [presentAlert] = useIonAlert()

  const hideBackground = async () => {
    BarcodeScanner.hideBackground();
    const selector = document.querySelector('body')
    if (selector === null)
      return

    selector.style.background = 'transparent';
  } 

  const showBackground = async () => {
    BarcodeScanner.showBackground();
    const selector = document.querySelector('body')
    if (selector === null)
      return

    selector.style.background = '';
  }

  const checkPermissions = async (): Promise<boolean> => {
    // check if user already granted permission
    const status = await BarcodeScanner.checkPermission({ force: false });

    if (status.granted) {
      // user granted permission
      return true;
    }

    if (status.denied) {
      // user denied permission
      return false;
    }

    if (status.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (status.neverAsked) {
      // user has not been requested this permission before
      // it is advised to show the user some sort of prompt
      // this way you will not waste your only chance to ask for the permission
      await presentAlert({
        header: 'Permission',
        subHeader: 'Une permission est requise',
        message: 'Nous avons besoin de votre permission pour accèder à la caméra',
        buttons: ['OK'],
      });

      return false;
    }

    if (status.restricted || status.unknown) {
      // ios only
      // probably means the permission has been denied
      return false;
    }

    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest = await BarcodeScanner.checkPermission({ force: true });

    if (statusRequest.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (statusRequest.granted) {
      // the user did grant the permission now
      return true;
    }

    // user did not grant the permission, so he must have declined the request
    return false;
  }

  const startScan = async (): Promise<string | null> => {
    await BarcodeScanner.prepare()
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (!status.granted) {
      return null;
    }

    await hideBackground(); // make background of WebView transparent
    // document.body.style.background = "transparent";
  
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
  
    return result.content ?? null;
  };

  const stopScan = async () => {
    await showBackground();
    await BarcodeScanner.stopScan();
  };

  return {
    checkPermissions,
    startScan,
    stopScan,
  }
}
