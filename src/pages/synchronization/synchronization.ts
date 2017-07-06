import { DailyFrequenciesSynchronizer } from '../../services/offline_data_synchronization/daily_frequencies_synchronizer';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-synchronization',
  templateUrl: 'synchronization.html',
})
export class SynchronizationPage {
  private dailyFrequenciesToSync = []


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private storage: Storage,
              private dailyFrequenciesSynchronizer: DailyFrequenciesSynchronizer) {

    this.setDailyFrequencies()
  }

  syncDailyFrequencies(){
    this.dailyFrequenciesSynchronizer.sync(this.dailyFrequenciesToSync).subscribe(
      (result) => {
        console.log('frequency sent!', result)
      },
      (error) => {
        console.log('an error ocurred!')
      },
      () => {
        console.log('all frequencies completed')
      }
    )
  }

  private setDailyFrequencies(){
    this.storage.get('dailyFrequenciesToSync').then((dailyFrequenciesToSync) => {
      this.dailyFrequenciesToSync = dailyFrequenciesToSync
    })
  }

}
