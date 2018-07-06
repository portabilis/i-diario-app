import { Injectable } from '@angular/core';

@Injectable()
export class SyncProvider {
  private isSyncingStatus: Boolean;

  constructor() {
    this.isSyncingStatus = false;
  }

  start() {
    this.isSyncingStatus = true;
  }

  cancel() {
    this.isSyncingStatus = false;
  }

  complete() {
    this.isSyncingStatus = false;
  }

  isSyncing() {
    return this.isSyncingStatus;
  }

}
