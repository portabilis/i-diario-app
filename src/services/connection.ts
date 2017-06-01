import { Network } from '@ionic-native/network';
import { Injectable } from '@angular/core';

@Injectable()
export class ConnectionService {
  public isOnline:boolean;

  constructor(private network: Network){
    this.isOnline = (this.network.type !== "none");
  }
  setStatus(online: boolean){
    this.isOnline = online;
  }
}