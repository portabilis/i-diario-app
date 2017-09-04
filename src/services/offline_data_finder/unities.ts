import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class OfflineUnityFinder {
  constructor(
    private storage: Storage
  ){}

  find(params){
    return new Observable((observer) => {
      this.storage.get('unities').then((unities) => {
        if (params.unityId) {
          unities = unities.filter((unityId) => {
            return unityId.id == params.unityId
          })
        }
        observer.next(unities[0])
        observer.complete()
      })
    })
  }
}