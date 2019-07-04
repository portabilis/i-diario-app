import { Observable } from 'rxjs/Observable';
import { ConnectionService } from './connection';
import { ApiService } from './api';
import { Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { SchoolCalendarsService } from '../services/school_calendars';
import 'rxjs/Rx';
import { UtilsService } from './utils';
import { CustomHttp } from './custom_http';

@Injectable()
export class ClassroomsService {
  constructor(
    private http: CustomHttp,
    private storage: Storage,
    private connection: ConnectionService,
    private api: ApiService,
    private utilsService: UtilsService,
    private schoolCalendarsService: SchoolCalendarsService
  ){}

  getOnlineClassrooms(teacherId: number, unityId: number){
    const request = this.http.get(this.api.getTeatcherClassroomsUrl(), { params: { teacher_id: teacherId, unity_id: unityId } } );
    return request.map((response: Response) => {
      return {
        data: response.json(),
        unityId: unityId
      }
    });
  }

  getOfflineClassrooms(unityId: number){
    return new Observable((observer) => {
      this.storage.get('classrooms').then((classrooms) => {
        if (!classrooms){
          observer.complete();
          return;
        }
        var currentYear = (this.utilsService.getCurrentDate()).getFullYear();
        classrooms.forEach((classroom) => {
          this.schoolCalendarsService.getOfflineSchoolCalendar(unityId).subscribe((schoolCalendar: any) => {
            let currentDate = new Date();
            var hasStepOnCurrentDate = schoolCalendar.data.steps.filter((step) => {
              let start_date = new Date(step.start_date_for_posting || step.start_at);
              let end_date = new Date(step.end_date_for_posting || step.end_at);

              return (start_date <= currentDate) && (end_date >= currentDate);
            }).length >= 1;

            if (!hasStepOnCurrentDate) {
              observer.error("Data atual está fora do período de postagem de faltas. Tente novamente.")
              observer.complete();
              return;
            }

            if (classroom.unityId == unityId) {
              classroom.data = classroom.data.filter((value) => {
                return (value.year || currentYear) == (schoolCalendar.data.year || currentYear)
              })
              observer.next(classroom);
              observer.complete();
            }
          });
        });
      });
    });
  }
}
