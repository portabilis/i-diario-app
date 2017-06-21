import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { UnitiesService } from './../unities';
import { Injectable } from '@angular/core';


@Injectable()

export class UnitiesPersisterService{
  constructor(
    private unities: UnitiesService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.unities.getUnities(user.teacher_id).subscribe(
        (unities) => {
          observer.next(this.storage.set('unities', unities))
        },
        (error) => {
          console.log(error)
        },
        () => {
          observer.complete()
        }
      )
    })
  }
}