import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class OfflineClassroomFinder {
  constructor(
    private storage: Storage
  ){}

  find(params){
    return new Observable((observer) => {
      this.storage.get('classrooms').then((allClassrooms) => {
        let classrooms = [];
        if (params.unityId) {
          classrooms = allClassrooms.filter((classroom) => {
            return classroom.unityId == params.unityId
          })
        }

        if (params.classroomId) {
          allClassrooms.forEach(d => {
            d.data.forEach(classroom => {
              if(classroom.id == params.classroomId){
                classrooms.push(classroom);
              }
            });
          });
        }

        if (classrooms.length === 1 || params.classroomId) {
          classrooms = classrooms[0]
        }

        observer.next(classrooms)
        observer.complete()
      })
    })
  }
}
