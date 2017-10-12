import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class OfflineDisciplineFinder {
  constructor(
    private storage: Storage
  ){}

  find(params){
    return new Observable((observer) => {
      this.storage.get('disciplines').then((allDisciplines) => {
        let disciplines = [];
        if (params.disciplineId) {
          allDisciplines.forEach(d => {
            d.data.forEach(discipline => {
              if(discipline.id == params.disciplineId){
                disciplines.push(discipline);
              }
            });
          });
        }

        if (disciplines.length === 1 || params.disciplineId) {
          disciplines = disciplines[0]
        }

        observer.next(disciplines)
        observer.complete()
      })
    })
  }
}
