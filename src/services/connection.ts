import { Network } from '@ionic-native/network';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ConnectionService {
  public isOnline:boolean;
  public eventOnline: EventEmitter<any> = new EventEmitter;

  constructor(private network: Network){
    this.isOnline = (this.network.type !== "none");
  }
  setStatus(online: boolean){
    this.isOnline = online;
    this.eventOnline.emit(this.isOnline);
  }
  getNetworkType() {
    return this.network.type;
  }
}