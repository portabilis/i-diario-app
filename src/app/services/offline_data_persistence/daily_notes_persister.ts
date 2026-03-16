import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../data/user.interface';
import { StorageService } from '../storage.service';
import { DailyNotesService } from '../daily_notes';
import { tap } from "rxjs/operators";

@Injectable()
export class DailyNotesPersisterService {
  constructor(
    private dailyNotes: DailyNotesService,
    private storage: StorageService,
  ) {}

  persist(user: User, disciplines: any): Observable<any> {
    const dailyNotesObservables = this.dailyNotes.getDailyNotes(
      user.teacher_id,
      disciplines,
    );

    const setDailyNotesInStorage = tap((dailyNotes) =>
      this.storage.set('dailyNotes', dailyNotes),
    );

    return dailyNotesObservables.pipe(setDailyNotesInStorage);
  }
}
