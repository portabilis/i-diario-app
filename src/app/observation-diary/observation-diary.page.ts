import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservationDiaryService } from '../services/observation_diary';
import { ObservationDiaryApi } from '../data/types';
import { SyncProvider } from "../services/sync";
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-observation-diary',
  templateUrl: 'observation-diary.page.html',
  styleUrls: ['observation-diary.page.scss'],
  standalone: false,
})
export class ObservationDiaryPage {
  diaryDays: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private diaryService: ObservationDiaryService,
    private sync: SyncProvider,
  ) {}

  async ionViewWillEnter() {
    this.route.params.subscribe(async () => {
      await this.loadDiaries();
    });
  }

  async loadDiaries() {
    this.diaryDays = await this.diaryService.groupDiariesByDateAndUnity();
  }

  async openDetail(diaryId: number) {
    await this.router.navigate(['/observation-diary/form', diaryId]);
  }

  async createNew() {
    await this.router.navigate(['/observation-diary/form']);
  }

  getObservationCount(diary: ObservationDiaryApi): number {
    return this.diaryService.getObservationCount(diary);
  }

  getSyncIcon(synced: boolean): string {
    return synced ? 'checkmark-circle' : 'sync-circle';
  }

  getSyncColor(synced: boolean): string {
    return synced ? 'success' : 'warning';
  }

  async doRefresh() {
    await lastValueFrom(this.sync.execute());
    await this.loadDiaries();
  }
}
