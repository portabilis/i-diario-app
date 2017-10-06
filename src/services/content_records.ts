import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { ApiService } from './api';
import { ConnectionService } from './connection';
import { AuthService } from './auth';
import { ContentRecordsSynchronizer } from './offline_data_synchronization/content_records_synchronizer';

@Injectable()
export class ContentRecordsService {
  constructor(
    private http: Http,
    private storage: Storage,
    private api: ApiService,
    private connectionService: ConnectionService,
    private contentRecordsSynchronizer: ContentRecordsSynchronizer,
    private authService: AuthService
  ){}

  getContentRecords(teacherId: number){
    const request = this.http.get(this.api.getContentRecordsUrl(), { params: { teacher_id: teacherId } } );
    return request.map((response: Response) => {
      return response.json();
    });
  }

  updateContentRecordsToSync(contentRecordsToSync){
    return this.storage.set('contentRecordsToSync', contentRecordsToSync);
  }

  updateContentRecords(contentRecords){
    return this.storage.set('contentRecords', contentRecords);
  }

  addOrReplaceContentRecord(contentRecords, contentRecord){
    let index = -1;
    contentRecords.forEach((cr,i)=>{
      if(
        contentRecord.grade_id == cr.grade_id &&
        contentRecord.classroom_id == cr.classroom_id &&
        contentRecord.discipline_id == cr.discipline_id &&
        contentRecord.unity_id == cr.unity_id &&
        contentRecord.record_date == cr.record_date
       ){
        index = i;
        return;
      }
    });

    if(index>=0){
      contentRecords[index] = contentRecord;
    }else{
      contentRecords.push(contentRecord);
    }
    return contentRecords;
  }

  createOrUpdate(contentRecord: any){
    return new Observable((observer) => {
      Observable.forkJoin(
        Observable.fromPromise(this.storage.get('contentRecordsToSync')),
        Observable.fromPromise(this.storage.get('contentRecords'))
      ).subscribe((results) => {

        let contentRecordsToSync = results[0] || [];
        let contentRecords = results[1] || [];

        Observable.forkJoin(
          this.updateContentRecordsToSync(this.addOrReplaceContentRecord(contentRecordsToSync, contentRecord)),
          this.updateContentRecords(this.addOrReplaceContentRecord(contentRecords, contentRecord))
        ).subscribe(()=>{
          this.trySynchronizeContentRecords([contentRecord]);
          observer.next([contentRecord]);
          observer.complete();
        });
      });
    });
  }

  trySynchronizeContentRecords(records){
    if(this.connectionService.isOnline){
      this.authService.currentUser().then(user => {
        this.contentRecordsSynchronizer.sync(records, user['teacher_id']).subscribe();
      });

    }
  }
}