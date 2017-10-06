import { User } from './../../data/user.interface';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { ContentLessonPlansService } from './../content_lesson_plans';
import { Injectable } from '@angular/core';


@Injectable()

export class ContentLessonPlansPersisterService{
  constructor(
    private contentLessonPlansService: ContentLessonPlansService,
    private storage: Storage
  ){}

  persist(user: User){
    return new Observable((observer) => {
      this.contentLessonPlansService.getContentLessonPlans(user.teacher_id).subscribe(
        (contentLessonPlans) => {
          observer.next(this.storage.set('contentLessonPlans', contentLessonPlans['lesson_plans']||[]))
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