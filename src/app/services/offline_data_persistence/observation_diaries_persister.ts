import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../data/user.interface';
import { StorageService } from '../storage.service';
import { ObservationDiaryService } from "../observation_diary";

@Injectable()
export class ObservationDiariesPersisterService {
  constructor(
    private observationDiaries: ObservationDiaryService,
    private storage: StorageService,
  ) {}

  persist(user: User): Observable<any> {
    const observationDiariesObservables = this.observationDiaries.getObservationDiaries(
      user.teacher_id,
    );

    const setObservationDiariesInStorage = tap((observationDiaries) =>
      this.storage.set('observationDiaries', observationDiaries),
    );

    return observationDiariesObservables.pipe(setObservationDiariesInStorage);
  }
}
