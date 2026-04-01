import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private initialized = false;
  public serverUrl: string = '';

  constructor(private storage: Storage) {}

  async init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    await this.storage.create();
    await this.initializeDefaultData();
    this.serverUrl = (await this.storage.get('serverUrl')) || '';
  }

  // TODO verificar
  // Algumas das estruturas abaixo não condizem com uma listagem (array)
  private async initializeDefaultData() {
    const defaults = {
      classrooms: [],
      contentLessonPlans: [],
      contentRecords: [],
      disciplines: [],
      examRules: [],
      // frequencies: null,
      // lessonPlans: null,
      schoolCalendars: [],
      students: [],
      // teachingPlans: null,
      unities: [],
      user: null,
    };

    for (const [key, value] of Object.entries(defaults)) {
      const existingValue = await this.storage.get(key);

      if (existingValue === null) {
        await this.storage.set(key, value);
      }
    }
  }

  async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  async get(key: string) {
    return await this.storage.get(key);
  }

  async remove(key: string) {
    await this.storage.remove(key);
  }

  async clear() {
    await this.storage.clear();
  }
}
