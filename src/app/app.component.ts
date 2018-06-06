import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable'
import { DailyFrequencyStudentsSynchronizer } from './../services/offline_data_synchronization/daily_frequency_students_synchronizer';
import { DailyFrequenciesSynchronizer } from './../services/offline_data_synchronization/daily_frequencies_synchronizer';
import { ContentRecordsSynchronizer } from './../services/offline_data_synchronization/content_records_synchronizer';
import { AuthService } from './../services/auth';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { SignIn } from '../pages/sign-in/sign-in';
import { ConnectionService } from './../services/connection';
import { AppIndexPage } from "../pages/app-index/app-index";
import { UtilsService } from './../services/utils';
import { MessagesService } from './../services/messages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SignIn;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              network: Network,
              private connectionService: ConnectionService,
              private auth: AuthService,
              private dailyFrequenciesSynchronizer: DailyFrequenciesSynchronizer,
              private dailyFrequencyStudentsSynchronizer: DailyFrequencyStudentsSynchronizer,
              private contentRecordsSynchronizer: ContentRecordsSynchronizer,
              private storage: Storage,
              private messages: MessagesService,
              private utilsService: UtilsService,
            ) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      network.onConnect().subscribe(() => {
        this.connectionService.setStatus(true);
        this.syncOfflineData()
      });
      network.onDisconnect().subscribe(() => {
        this.connectionService.setStatus(false);
      });

      this.auth.currentUser().then((result) => {
        if(result){
          this.rootPage = AppIndexPage
        }
      })

    });
  }

  private showIsSynchronizingToast() {
    this.messages.showToast('As frequências lançadas estão sendo sincronizadas.', 2000);
  }

  private showIsSychronizedToast() {
    this.messages.showToast('As frequências lançadas foram sincronizadas com sucesso.', 2000);
  }

  private showSynchronizationErrorToast() {
    this.messages.showToast('Não foi possível sincronizar as frequências lançadas.', 2000);
  }

  private syncOfflineData(){
    this.storage.get('dailyFrequenciesToSync').then((dailyFrequenciesToSync) => {
      this.storage.get('dailyFrequencyStudentsToSync').then((dailyFrequencyStudentsToSync) => {
        if (!dailyFrequenciesToSync && !dailyFrequencyStudentsToSync) return;
        this.showIsSynchronizingToast();
        this.dailyFrequenciesSynchronizer.sync(dailyFrequenciesToSync).subscribe(
          () => {
          },
          (error) => {
            this.showSynchronizationErrorToast();
          },
          () => {
            this.storage.remove('dailyFrequenciesToSync')
            this.dailyFrequencyStudentsSynchronizer.sync(dailyFrequencyStudentsToSync).subscribe(
              () => {
              },
              (error) => {
                this.showSynchronizationErrorToast();
              },
              () => {
                this.showIsSychronizedToast();
                this.syncOfflineContentRecordsData();
              }
            )
          }
        )
      })
    })
  }

  private syncOfflineContentRecordsData(){
    Observable.forkJoin(
      this.auth.currentUser(),
      this.storage.get('contentRecordsToSync')
    ).subscribe((result) => {
      let user = result[0];
      let contentRecords = result[1];
      if(!contentRecords || !contentRecords.length ){
        return;
      }
      this.showIsSynchronizingToast();;
      this.contentRecordsSynchronizer.sync(contentRecords, user['teacher_id']).subscribe(
        () => {
        },
        (error) => {
          this.showSynchronizationErrorToast();
        },
        () => {
          this.showIsSychronizedToast();
        }
      );
    });
  }
}

