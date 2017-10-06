import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable'
import { DailyFrequencyStudentsSynchronizer } from './../services/offline_data_synchronization/daily_frequency_students_synchronizer';
import { DailyFrequenciesSynchronizer } from './../services/offline_data_synchronization/daily_frequencies_synchronizer';
import { ContentRecordsSynchronizer } from './../services/offline_data_synchronization/content_records_synchronizer';
import { AuthService } from './../services/auth';
import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { SignIn } from '../pages/sign-in/sign-in';

import { ConnectionService } from './../services/connection';

import { AppIndexPage } from "../pages/app-index/app-index";

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
              private toastCtrl: ToastController) {
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

  private syncOfflineData(){
    const isSynchronizingToast = this.toastCtrl.create({
      message: 'As frequências lançadas estão sendo sincronizadas.',
      duration: 2000,
      position: 'middle'
    })

    const isSychronizedToast = this.toastCtrl.create({
      message: 'As frequências lançadas foram sincronizadas com sucesso.',
      duration: 2000,
      position: 'middle'
    })

    const synchronizationErrorToast = this.toastCtrl.create({
      message: 'Não foi possível sincronizar as frequências lançadas.',
      duration: 2000,
      position: 'middle'
    })

    this.storage.get('dailyFrequenciesToSync').then((dailyFrequenciesToSync) => {
      this.storage.get('dailyFrequencyStudentsToSync').then((dailyFrequencyStudentsToSync) => {
        if (!dailyFrequenciesToSync && !dailyFrequencyStudentsToSync) return;
        isSynchronizingToast.present()
        this.dailyFrequenciesSynchronizer.sync(dailyFrequenciesToSync).subscribe(
          () => {
          },
          (error) => {
            synchronizationErrorToast.present()
          },
          () => {
            this.storage.remove('dailyFrequenciesToSync')
            this.dailyFrequencyStudentsSynchronizer.sync(dailyFrequencyStudentsToSync).subscribe(
              () => {
              },
              (error) => {
                synchronizationErrorToast.present()
              },
              () => {
                isSychronizedToast.present();
                this.syncOfflineContentRecordsData();
              }
            )
          }
        )
      })
    })
  }

  private syncOfflineContentRecordsData(){
    const isSynchronizingToast = this.toastCtrl.create({
      message: 'Os conteúdos lançados estão sendo sincronizados.',
      duration: 2000,
      position: 'middle'
    });

    const isSychronizedToast = this.toastCtrl.create({
      message: 'Os conteuídos lançados foram sincronizados com sucesso.',
      duration: 2000,
      position: 'middle'
    });

    const synchronizationErrorToast = this.toastCtrl.create({
      message: 'Não foi possível sincronizar os conteúdos lançados.',
      duration: 2000,
      position: 'middle'
    });

    Observable.forkJoin(
      this.auth.currentUser(),
      this.storage.get('contentRecordsToSync')
    ).subscribe((result) => {
      let user = result[0];
      let contentRecords = result[1];
      if(!contentRecords || !contentRecords.length ){
        return;
      }
      isSynchronizingToast.present();
      this.contentRecordsSynchronizer.sync(contentRecords, user['teacher_id']).subscribe(
        () => {
        },
        (error) => {
          synchronizationErrorToast.present()
        },
        () => {
          isSychronizedToast.present();
        }
      );
    });
  }
}

