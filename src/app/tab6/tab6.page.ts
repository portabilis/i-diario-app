import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyNotesService } from '../services/daily_notes';
import { SyncProvider } from "../services/sync";
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tab6',
  templateUrl: 'tab6.page.html',
  styleUrls: ['tab6.page.scss'],
  standalone: false,
})
export class Tab6Page {
  dailyNotes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dailyNotesService: DailyNotesService,
    private sync: SyncProvider,
  ) {}

  async ionViewWillEnter() {
    this.route.params.subscribe(async () => {
      await this.loadDailyNotesData();
    });
  }

  async loadDailyNotesData() {
    this.dailyNotes = await this.dailyNotesService.getAllAvaliations();
  }

  getSyncIcon(synced: boolean): string {
    return synced ? 'checkmark-circle' : 'sync-circle';
  }

  getSyncColor(synced: boolean): string {
    return synced ? 'success' : 'warning';
  }

  async openDailyNoteForm(avaliationId: number) {
    await this.router.navigate([
      '/daily-note-form',
      avaliationId,
    ]);
  }

  async doRefresh() {
    await lastValueFrom(this.sync.execute());
    await this.loadDailyNotesData();
  }
}
