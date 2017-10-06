import { ApiService } from './../api'
import { Observable } from 'rxjs/Observable'
import { Http, Response } from '@angular/http'
import { Storage } from '@ionic/storage'
import { Injectable } from '@angular/core'

@Injectable()
export class ContentRecordsSynchronizer {
  constructor(
    private http: Http,
    private api: ApiService,
    private storage: Storage
  ){

  }

  public sync(contentRecords, teacherId){
    return new Observable((observer) => {
      if(contentRecords && contentRecords.length){
        let contentRecordObservables = []
        contentRecords.forEach(contentRecord => {
          contentRecord['teacher_id'] = teacherId;
          const request = this.http.post(this.api.getContentRecordsSyncUrl(), contentRecord);

          contentRecordObservables.push(request)
        })

        Observable.concat(...contentRecordObservables).subscribe(
          (result: Response) => {
            this.destroyPendingSyncRecord(result.json());
            observer.next(result)
          },
          (error) => {
            observer.error(error)
          },
          () => {
            observer.complete()
          }
        )
      }else{
        observer.complete()
      }
    })
  }

  destroyPendingSyncRecord(contentRecord){
    this.storage.get('contentRecordsToSync').then(contentRecords => {
      this.storage.set('contentRecordsToSync', contentRecords.filter(cr => {
        return contentRecord.classroom_id != cr.classroom_id ||
          contentRecord.discipline_id != cr.discipline_id ||
          contentRecord.record_date != cr.record_date;
      }));
    });
  }
}