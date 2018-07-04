import { Injectable } from '@angular/core';

@Injectable()
export class SyncProvider {
  public isSyncing: Boolean;

  constructor() {
    this.isSyncing = false;
  }

  start() {
    this.isSyncing = true;
  }

  cancel() {
    this.isSyncing = false;
  }

  complete() {
    this.isSyncing = false;
  }

}
