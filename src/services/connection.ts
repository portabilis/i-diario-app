import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';


@Injectable()
export class ConnectionService {
  // onDevice: boolean;
  constructor(private platform: Platform, private network: Network){
    // this.onDevice = this.platform.is('cordova');
  }

  isOnline(){
    return this.network.type !== "none";
  }
  isOffline(){
    return this.network.type === "none";
  }
}