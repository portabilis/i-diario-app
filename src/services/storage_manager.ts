import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageManagerService {
  constructor(
    private _storage: Storage
  ){}

  clearStorage(){
    this._storage.remove('unities');
    this._storage.remove('classrooms');
    this._storage.remove('disciplines');
    this._storage.remove('examRules');
    this._storage.remove('schoolCalendars');
    this._storage.remove('frequencies');
    this._storage.remove('dailyFrequencyStudentsToSync');
    this._storage.remove('dailyFrequenciesToSync');
    this._storage.remove('lessonPlans');
    this._storage.remove('teachinPlans');
  }
}