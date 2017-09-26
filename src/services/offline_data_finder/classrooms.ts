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
      this.storage.get('classrooms').then((classrooms) => {
        if (params.unityId) {
          classrooms = classrooms.filter((classroom) => {
            return classroom.unityId == params.unityId
          })
        }

        if (params.classroomId) {
          classrooms = classrooms[0].data.filter((classroom) => {
            return classroom.id == params.classroomId
          })
        }

        if (classrooms.length === 1) {
          classrooms = classrooms[0]
        }

        observer.next(classrooms)
        observer.complete()
      })
    })
  }
}
