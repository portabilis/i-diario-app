import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { ContentRecordsService } from './../content_records';
import { Injectable } from '@angular/core';

@Injectable()

export class ContentRecordsPersisterService{
  constructor(
    private contentRecordsService: ContentRecordsService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.contentRecordsService.getContentRecords(user.teacher_id).subscribe(
        (contentRecords) => {
          observer.next(this.storage.set('contentRecords', (contentRecords['content_records']||[])));
        },
        (error) => {
          observer.error(error);
        },
        () => {
          observer.complete()
        }
      )
    })
  }
}