import { DailyFrequencyStudentsSynchronizer } from './../../services/offline_data_synchronization/daily_frequency_students_synchronizer';
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
  private dailyFrequencyStudentsToSync = []

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private storage: Storage,
              private dailyFrequenciesSynchronizer: DailyFrequenciesSynchronizer,
              private dailyFrequencyStudentsSynchronizer: DailyFrequencyStudentsSynchronizer) {

    this.setDailyFrequencies()
    this.setDailyFrequencyStudents()
  }

  syncDailyFrequencies(){
    
  }

  private setDailyFrequencies(){
    this.storage.get('dailyFrequenciesToSync').then((dailyFrequenciesToSync) => {
      this.dailyFrequenciesToSync = dailyFrequenciesToSync
    })
  }

  private setDailyFrequencyStudents(){
    this.storage.get('dailyFrequencyStudentsToSync').then((dailyFrequencyStudentsToSync) => {
      this.dailyFrequencyStudentsToSync = dailyFrequencyStudentsToSync
    })
  }

}
